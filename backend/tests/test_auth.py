from datetime import datetime, timedelta, timezone

import jwt
import pytest
from sqlalchemy import select

from app.core.config import settings
from app.core.security import verify_password
from app.models import RefreshSession, User

CREDENTIALS = {"username": "student", "password": "password123"}


def test_register_stores_hash_and_hides_it(client, db):
    response = client.post("/auth/register", json=CREDENTIALS)
    assert response.status_code == 201
    assert response.json() == {"id": 1, "username": "student"}
    user = db.scalar(select(User))
    assert user.password_hash.startswith("$argon2id$")
    assert verify_password(CREDENTIALS["password"], user.password_hash)
    assert not verify_password("wrong-password", user.password_hash)


def test_duplicate_username(client):
    assert client.post("/auth/register", json=CREDENTIALS).status_code == 201
    assert client.post("/auth/register", json=CREDENTIALS).status_code == 409


def test_invalid_credentials(client):
    assert client.post("/auth/register", json={
        "username": "ab", "password": "short",
    }).status_code == 422
    assert client.post("/auth/register", json={
        "username": "bad name", "password": "password123",
    }).status_code == 422


def login(client, username="student"):
    credentials = {**CREDENTIALS, "username": username}
    assert client.post("/auth/register", json=credentials).status_code == 201
    response = client.post("/auth/login", json=credentials)
    assert response.status_code == 200
    return {"Authorization": "Bearer " + response.json()["access_token"]}


def test_login_me_and_refresh(client, db):
    headers = login(client)
    assert client.get("/auth/me", headers=headers).json()["username"] == "student"
    payload = jwt.decode(headers["Authorization"][7:], settings.jwt_secret, algorithms=["HS256"])
    assert payload["exp"] - payload["iat"] == settings.access_token_minutes * 60
    refresh_cookie = client.cookies.get("refresh_token")
    session = db.scalar(select(RefreshSession))
    assert session.token_hash != refresh_cookie
    assert len(session.token_hash) == 64
    response = client.post("/auth/refresh")
    assert response.status_code == 200
    assert "refresh_token" not in response.json()
    assert client.get("/auth/me", headers={
        "Authorization": "Bearer " + response.json()["access_token"],
    }).status_code == 200


def test_wrong_password_and_unknown_user(client):
    login(client)
    for username in ("student", "unknown"):
        response = client.post("/auth/login", json={
            "username": username, "password": "wrong-password",
        })
        assert response.status_code == 401
        assert response.json()["detail"] == "Неверный логин или пароль"


def test_logout_revokes_only_current_session(client, db):
    login(client)
    first_cookie = client.cookies.get("refresh_token")
    client.post("/auth/login", json=CREDENTIALS)
    second_cookie = client.cookies.get("refresh_token")
    assert second_cookie != first_cookie
    assert client.post("/auth/logout").status_code == 204
    assert client.cookies.get("refresh_token") is None
    client.cookies.set("refresh_token", second_cookie)
    assert client.post("/auth/refresh").status_code == 401
    client.cookies.set("refresh_token", first_cookie)
    assert client.post("/auth/refresh").status_code == 200
    assert len(list(db.scalars(select(RefreshSession).where(RefreshSession.revoked)))) == 1


def test_expired_and_invalid_refresh(client, db):
    assert client.post("/auth/refresh").status_code == 401
    login(client)
    session = db.scalar(select(RefreshSession))
    session.expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)
    db.commit()
    assert client.post("/auth/refresh").status_code == 401
    client.cookies.set("refresh_token", "invalid-token")
    assert client.post("/auth/refresh").status_code == 401
    assert client.post("/auth/logout").status_code == 204


@pytest.mark.parametrize("change", ["expired", "signature", "type", "missing_exp", "subject"])
def test_reject_invalid_access(client, change):
    login(client)
    now = datetime.now(timezone.utc)
    payload = {"sub": "1", "type": "access", "iat": now, "exp": now + timedelta(minutes=5)}
    secret = settings.jwt_secret
    if change == "expired":
        payload["exp"] = now - timedelta(seconds=1)
    elif change == "signature":
        secret = "other-test-secret-with-32-characters"
    elif change == "type":
        payload["type"] = "refresh"
    elif change == "missing_exp":
        del payload["exp"]
    elif change == "subject":
        payload["sub"] = "not-a-user-id"
    token = jwt.encode(payload, secret, algorithm="HS256")
    assert client.get("/auth/me", headers={"Authorization": "Bearer " + token}).status_code == 401


def test_public_and_private_routes(client):
    assert client.get("/health").status_code == 200
    for path in ("/auth/me", "/decks", "/decks/1", "/decks/1/cards"):
        assert client.get(path).status_code == 401
    assert client.post("/decks", json={"title": "Private"}).status_code == 401


def test_user_cannot_access_another_users_data(client):
    owner_headers = login(client)
    deck = client.post("/decks", headers=owner_headers, json={"title": "Private"}).json()
    deck_id = deck["id"]
    card = client.post(f"/decks/{deck_id}/cards", headers=owner_headers, json={
        "question": "Question", "answer": "Answer",
    }).json()
    other_headers = login(client, "other")
    assert client.get("/decks", headers=other_headers).json() == []
    for method, path, data in (
        ("GET", f"/decks/{deck_id}", None),
        ("PATCH", f"/decks/{deck_id}", {"title": "Stolen"}),
        ("DELETE", f"/decks/{deck_id}", None),
        ("GET", f"/decks/{deck_id}/cards", None),
        ("POST", f"/decks/{deck_id}/cards", {"question": "Q", "answer": "A"}),
        ("PATCH", f"/cards/{card['id']}", {"learned": True}),
        ("DELETE", f"/cards/{card['id']}", None),
    ):
        assert client.request(method, path, headers=other_headers, json=data).status_code == 404
    assert client.patch(f"/cards/{card['id']}", headers=owner_headers,
                        json={"learned": True}).json()["learned"] is True
    assert client.delete(f"/decks/{deck_id}", headers=owner_headers).status_code == 204
    assert client.patch(f"/cards/{card['id']}", headers=owner_headers,
                        json={"learned": False}).status_code == 404
