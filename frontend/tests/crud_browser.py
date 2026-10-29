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
    page.route("**/api/decks", lambda route: route.fulfill(
        status=422, json={"detail": [{"field": "title", "message": "Проверочная ошибка валидации"}]},
    ))
    page.get_by_role("button", name="Создать", exact=True).click()
    expect(page.get_by_role("alert")).to_contain_text("Название: Проверочная ошибка валидации")
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

    page.get_by_role("button", name="Удалить колоду", exact=True).click()
    dialog = page.get_by_role("dialog")
    dialog.get_by_role("button", name="Отмена", exact=True).click()
    expect(page.get_by_role("heading", name="Переименованная колода", exact=True)).to_be_visible()
    page.get_by_role("button", name="Удалить колоду", exact=True).click()
    page.route(f"**/api/decks/{created['id']}", lambda route: route.fulfill(
        status=500, json={"detail": "Не удалось удалить колоду"},
    ))
    dialog.get_by_role("button", name="Удалить", exact=True).click()
    expect(dialog.get_by_role("alert")).to_contain_text("Не удалось удалить колоду")
    page.unroute(f"**/api/decks/{created['id']}")
    dialog.get_by_role("button", name="Удалить", exact=True).click()
    expect(page.get_by_role("heading", name="Мои колоды", exact=True)).to_be_visible()
    page.reload()
    expect(page.get_by_role("heading", name="Проверка API", exact=True)).to_be_visible()
    expect(page.get_by_role("heading", name="Переименованная колода", exact=True)).to_have_count(0)
    assert page.request.get(base + f"/api/decks/{created['id']}", headers=headers).status == 404

    page.goto(base + f"/decks/{deck['id']}")
    expect(page.get_by_role("heading", name="Проверка API", exact=True)).to_be_visible()
    page.get_by_role("button", name="Добавить карточку", exact=True).click()
    page.get_by_label("Вопрос", exact=True).fill("bridge")
    page.get_by_label("Ответ", exact=True).fill("мост")
    page.route(f"**/api/decks/{deck['id']}/cards", lambda route: route.fulfill(
        status=500, json={"detail": "Не удалось сохранить карточку"},
    ))
    page.get_by_role("button", name="Добавить", exact=True).click()
    expect(page.get_by_role("alert")).to_contain_text("Не удалось сохранить карточку")
    expect(page.get_by_label("Вопрос", exact=True)).to_have_value("bridge")
    page.unroute(f"**/api/decks/{deck['id']}/cards")
    page.get_by_role("button", name="Добавить", exact=True).click()
    expect(page.get_by_role("heading", name="bridge", exact=True)).to_be_visible()
    page.reload()
    expect(page.get_by_role("heading", name="bridge", exact=True)).to_be_visible()
    stored_cards = page.request.get(base + f"/api/decks/{deck['id']}/cards", headers=headers).json()
    assert len(stored_cards) == 2
    card = next(item for item in stored_cards if item["question"] == "bridge")

    page.get_by_test_id(f"card-{card['id']}").get_by_role("button", name="Редактировать карточку", exact=True).click()
    dialog = page.get_by_role("dialog")
    dialog.get_by_label("Вопрос", exact=True).fill("bridge updated")
    dialog.get_by_label("Ответ", exact=True).fill("мост (изменён)")
    dialog.get_by_role("button", name="Сохранить", exact=True).click()
    expect(dialog).to_be_hidden()
    page.reload()
    expect(page.get_by_role("heading", name="bridge updated", exact=True)).to_be_visible()
    stored_cards = page.request.get(base + f"/api/decks/{deck['id']}/cards", headers=headers).json()
    edited = next(item for item in stored_cards if item["id"] == card["id"])
    assert edited["question"] == "bridge updated"
    assert edited["answer"] == "мост (изменён)"
    assert edited["learned"] is False

    card_node = page.get_by_test_id(f"card-{card['id']}")
    card_node.get_by_role("button", name="Выучено", exact=True).click()
    expect(card_node.get_by_role("button", name="Убрать из выученных", exact=True)).to_be_visible()
    page.get_by_role("link", name="Статистика", exact=True).click()
    expect(page.get_by_text("Выучено 1 из 2 карточек", exact=True)).to_be_visible()
    page.reload()
    expect(page.get_by_text("Выучено 1 из 2 карточек", exact=True)).to_be_visible()
    page.goto(base + f"/decks/{deck['id']}")
    card_node = page.get_by_test_id(f"card-{card['id']}")
    card_node.get_by_role("button", name="Удалить", exact=True).click()
    dialog = page.get_by_role("dialog")
    dialog.get_by_role("button", name="Удалить", exact=True).click()
    expect(card_node).to_have_count(0)
    page.reload()
    expect(page.get_by_role("heading", name="bridge updated", exact=True)).to_have_count(0)
    remaining = page.request.get(base + f"/api/decks/{deck['id']}/cards", headers=headers).json()
    assert len(remaining) == 1
    page.get_by_role("link", name="Статистика", exact=True).click()
    expect(page.get_by_text("Выучено 0 из 1 карточек", exact=True)).to_be_visible()
    page.goto(base + f"/decks/{deck['id']}")
    page.get_by_role("button", name="Удалить колоду", exact=True).click()
    page.get_by_role("dialog").get_by_role("button", name="Удалить", exact=True).click()
    expect(page.get_by_text("Колод пока нет, создай первую", exact=True)).to_be_visible()
    assert page.request.patch(base + f"/api/cards/{remaining[0]['id']}", headers=headers,
                              data={"learned": True}).status == 404

    page.route("**/api/decks", lambda route: route.fulfill(status=403, json={}))
    page.reload()
    expect(page.get_by_role("alert")).to_contain_text("У вас нет доступа к этим данным")
    page.unroute("**/api/decks")
    page.get_by_role("button", name="Повторить", exact=True).click()
    expect(page.get_by_text("Колод пока нет, создай первую", exact=True)).to_be_visible()

    page.route("**/api/decks", lambda route: route.abort())
    page.reload()
    expect(page.get_by_role("alert")).to_contain_text("Не удалось связаться с сервером")
    page.unroute("**/api/decks")
    page.get_by_role("button", name="Повторить", exact=True).click()
    expect(page.get_by_text("Колод пока нет, создай первую", exact=True)).to_be_visible()

    pending = []
    page.route("**/api/decks", lambda route: pending.append(route))
    page.reload(wait_until="domcontentloaded")
    expect(page.get_by_text("Загружаем колоды…", exact=True)).to_be_visible()
    for request in pending:
        request.continue_()
    page.unroute("**/api/decks")
    expect(page.get_by_text("Колод пока нет, создай первую", exact=True)).to_be_visible()

    long_title = "Т" * 100
    private_deck = page.request.post(base + "/api/decks", headers=headers,
                                     data={"title": long_title}).json()
    assert page.request.post(base + f"/api/decks/{private_deck['id']}/cards", headers=headers,
                             data={"question": "Q" * 500, "answer": "A" * 500}).status == 201
    page.set_viewport_size({"width": 320, "height": 740})
    page.goto(base + f"/decks/{private_deck['id']}")
    expect(page.get_by_role("heading", name=long_title, exact=True)).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Переполнение на мобильном экране"
    page.set_viewport_size({"width": 1280, "height": 900})

    page.get_by_role("button", name="Выйти", exact=True).click()
    expect(page.get_by_role("heading", name="Вход", exact=True)).to_be_visible()
    other = {"username": "other_crud_" + token_hex(4), "password": "other-password123"}
    assert page.request.post(base + "/api/auth/register", data=other).status == 201
    other_login = page.request.post(base + "/api/auth/login", data=other)
    other_headers = {"Authorization": "Bearer " + other_login.json()["access_token"]}
    page.goto(base)
    expect(page.get_by_text("Колод пока нет, создай первую", exact=True)).to_be_visible()
    page.goto(base + f"/decks/{private_deck['id']}")
    expect(page.get_by_role("heading", name="Колода не найдена", exact=True)).to_be_visible()
    assert page.request.get(base + f"/api/decks/{private_deck['id']}", headers=other_headers).status == 404
    assert not errors, errors
    print("CRUD колод и карточек, отметка выучено, статистика, сохранение и каскадное удаление — OK")
    browser.close()
