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
