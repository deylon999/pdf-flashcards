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

    page.get_by_role("link", name="Главная", exact=True).click()
    page.get_by_role("button", name="Новая колода", exact=True).click()
    page.get_by_label("Название колоды", exact=True).fill("Из интерфейса")
    page.get_by_label("Описание", exact=True).fill("Сохранится после перезагрузки")
    page.route("**/api/decks", lambda route: route.fulfill(
        status=500, json={"detail": "Тестовая ошибка сохранения"},
    ) if route.request.method == "POST" else route.continue_())
    page.get_by_role("button", name="Создать", exact=True).click()
    expect(page.get_by_role("alert")).to_contain_text("Тестовая ошибка сохранения")
    expect(page.get_by_label("Название колоды", exact=True)).to_have_value("Из интерфейса")
    page.unroute("**/api/decks")
    page.get_by_role("button", name="Создать", exact=True).click()
    expect(page.get_by_role("heading", name="Из интерфейса", exact=True)).to_be_visible()
    expect(page.get_by_label("Название колоды", exact=True)).to_have_value("")
    page.reload()
    expect(page.get_by_role("heading", name="Из интерфейса", exact=True)).to_be_visible()
    stored_decks = page.request.get(base + "/api/decks", headers=headers).json()
    assert len([item for item in stored_decks if item["title"] == "Из интерфейса"]) == 1

    created = next(item for item in stored_decks if item["title"] == "Из интерфейса")
    page.goto(base + f"/decks/{created['id']}")
    expect(page.get_by_role("heading", name="Из интерфейса", exact=True)).to_be_visible()
    page.get_by_role("button", name="Редактировать колоду", exact=True).click()
    page.get_by_label("Название колоды", exact=True).fill("Переименованная колода")
    page.get_by_label("Описание", exact=True).fill("Новое описание")
    page.get_by_role("button", name="Сохранить", exact=True).click()
    expect(page.get_by_role("heading", name="Переименованная колода", exact=True)).to_be_visible()
    page.reload()
    expect(page.get_by_role("heading", name="Переименованная колода", exact=True)).to_be_visible()
    expect(page.get_by_text("Новое описание", exact=True)).to_be_visible()
    assert not errors, errors
    print("Чтение PostgreSQL, создание и редактирование колоды через интерфейс — OK")
    browser.close()
