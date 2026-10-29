"""Проверка интеграции с запущенными frontend, backend и PostgreSQL."""
from secrets import token_hex

from playwright.sync_api import expect, sync_playwright

base = "http://127.0.0.1:5173"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    credentials = {"username": "crud_" + token_hex(4), "password": "crud-password123"}
    assert page.request.post(base + "/api/auth/register", data=credentials).status == 201
    login = page.request.post(base + "/api/auth/login", data=credentials)
    assert login.status == 200
    headers = {"Authorization": "Bearer " + login.json()["access_token"]}
    page.goto(base)
    expect(page.get_by_text("Колод пока нет, создай первую", exact=True)).to_be_visible()

    deck = page.request.post(base + "/api/decks", headers=headers,
                             data={"title": "Проверка API", "description": "Из PostgreSQL"}).json()
    assert page.request.post(base + f"/api/decks/{deck['id']}/cards", headers=headers,
                             data={"question": "apple", "answer": "яблоко"}).status == 201
    page.reload()
    expect(page.get_by_role("heading", name="Проверка API", exact=True)).to_be_visible()
    expect(page.get_by_text("Карточек: 1", exact=True)).to_be_visible()
    page.get_by_role("link", name="Проверка API Из PostgreSQL Карточек: 1").click()
    expect(page.get_by_role("heading", name="Проверка API", exact=True)).to_be_visible()
    expect(page.get_by_text("Карточка 1 из 1", exact=True)).to_be_visible()
    page.get_by_role("link", name="Статистика", exact=True).click()
    expect(page.get_by_text("Выучено 0 из 1 карточек", exact=True)).to_be_visible()
    assert not errors, errors
    print("Чтение PostgreSQL через интерфейс: пустой список, колода, карточки и статистика — OK")
    browser.close()
