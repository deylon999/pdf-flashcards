from sqlalchemy import select

from app.core.security import verify_password
from app.models import User

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
