from sqlalchemy import func, select

from app.models import Card


def sign_in(client, username):
    data = {"username": username, "password": "test-password123"}
    assert client.post("/auth/register", json=data).status_code == 201
    response = client.post("/auth/login", json=data)
    assert response.status_code == 200
    return {"Authorization": "Bearer " + response.json()["access_token"]}


def test_list_contains_cards_only_from_owned_decks(client):
    headers = sign_in(client, "owner")
    assert client.get("/decks", headers=headers).json() == []
    deck = client.post("/decks", headers=headers, json={"title": "English"}).json()
    for question in ("apple", "window"):
        response = client.post(f"/decks/{deck['id']}/cards", headers=headers,
                               json={"question": question, "answer": "Translation"})
        assert response.status_code == 201
    result = client.get("/decks", headers=headers).json()
    assert len(result) == 1
    assert result[0]["id"] == deck["id"]
    assert [card["question"] for card in result[0]["cards"]] == ["apple", "window"]
    assert all(card["learned"] is False for card in result[0]["cards"])
    other_headers = sign_in(client, "other")
    assert client.get("/decks", headers=other_headers).json() == []


def test_crud_values_and_cascade_delete(client, db):
    headers = sign_in(client, "crud_owner")
    deck = client.post("/decks", headers=headers, json={"title": "Original"}).json()
    deck_url = f"/decks/{deck['id']}"
    assert client.patch(deck_url, headers=headers, json={
        "title": "  Updated  ", "description": "Description",
    }).status_code == 200
    card = client.post(deck_url + "/cards", headers=headers, json={
        "question": "Before", "answer": "Before",
    }).json()
    card_url = f"/cards/{card['id']}"
    assert client.patch(card_url, headers=headers, json={
        "question": "After", "answer": "Answer", "learned": True,
    }).status_code == 200
    db.expire_all()
    result = client.get(deck_url, headers=headers).json()
    assert result["title"] == "Updated"
    assert result["description"] == "Description"
    assert result["cards"][0]["question"] == "After"
    assert result["cards"][0]["answer"] == "Answer"
    assert result["cards"][0]["learned"] is True
    assert client.delete(card_url, headers=headers).status_code == 204
    assert client.get(deck_url, headers=headers).json()["cards"] == []
    assert client.patch(card_url, headers=headers, json={"learned": False}).status_code == 404
    assert client.post(deck_url + "/cards", headers=headers, json={
        "question": "Cascade", "answer": "Delete with deck",
    }).status_code == 201
    assert client.delete(deck_url, headers=headers).status_code == 204
    assert client.get(deck_url, headers=headers).status_code == 404
    assert client.get("/decks", headers=headers).json() == []
    assert db.scalar(select(func.count()).select_from(Card)) == 0


def test_crud_validation(client):
    headers = sign_in(client, "validation_owner")
    assert client.post("/decks", headers=headers, json={"title": " "}).status_code == 422
    deck = client.post("/decks", headers=headers, json={"title": "Valid"}).json()
    assert client.patch(f"/decks/{deck['id']}", headers=headers,
                        json={"description": "x" * 301}).status_code == 422
    assert client.post(f"/decks/{deck['id']}/cards", headers=headers,
                       json={"question": "Q", "answer": " "}).status_code == 422
    assert client.post(f"/decks/{deck['id']}/cards", headers=headers,
                       json={"question": "x" * 501, "answer": "A"}).status_code == 422
