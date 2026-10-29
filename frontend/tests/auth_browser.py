"""Проверка ЛР4 в браузере. Нужны запущенные frontend/backend и пакет playwright."""
from secrets import token_hex

from playwright.sync_api import expect, sync_playwright


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://127.0.0.1:5173/stats")
    expect(page.get_by_role("heading", name="Вход", exact=True)).to_be_visible()
    assert page.url.endswith("/login")
    page.get_by_role("link", name="Нет аккаунта? Зарегистрироваться").click()
    expect(page.get_by_role("heading", name="Регистрация", exact=True)).to_be_visible()
    page.get_by_role("button", name="Создать аккаунт", exact=True).click()
    expect(page.get_by_text("От 3 до 50 символов: латинские буквы, цифры и _", exact=True)).to_be_visible()
    username = "browser_" + token_hex(4)
    page.get_by_label("Логин", exact=True).fill(username)
    page.get_by_label("Пароль", exact=True).fill("browser-password123")
    page.get_by_role("button", name="Создать аккаунт", exact=True).click()
    expect(page.get_by_role("heading", name="Статистика", exact=True)).to_be_visible()

    # Недействующий access должен обновиться и повторить исходный запрос.
    current_user = page.evaluate("""async () => {
        const moduleUrl = performance.getEntriesByType('resource')
            .find(entry => new URL(entry.name).pathname === '/src/shared/api/client.ts').name;
        const api = await import(moduleUrl);
        api.setAccessToken('expired-access-token');
        return await api.apiRequest('/auth/me');
    }""")
    assert current_user["username"] == username

    page.get_by_role("link", name="Главная", exact=True).click()
    page.get_by_role("button", name="Новая колода", exact=True).click()
    page.get_by_label("Название колоды", exact=True).fill("Только в этой сессии")
    page.get_by_role("button", name="Создать", exact=True).click()
    expect(page.get_by_text("Только в этой сессии", exact=True)).to_be_visible()

    # При ошибке сервера выход можно повторить; интерфейс не сообщает об успешном выходе.
    page.route("**/api/auth/logout", lambda route: route.abort())
    page.get_by_role("button", name="Выйти", exact=True).click()
    expect(page.get_by_role("alert")).to_contain_text("Не удалось завершить сессию")
    page.unroute("**/api/auth/logout")
    page.get_by_role("button", name="Выйти", exact=True).click()
    expect(page.get_by_role("heading", name="Вход", exact=True)).to_be_visible()
    page.get_by_role("link", name="Нет аккаунта? Зарегистрироваться").click()
    expect(page.get_by_role("heading", name="Регистрация", exact=True)).to_be_visible()
    page.get_by_label("Логин", exact=True).fill(username)
    page.get_by_label("Пароль", exact=True).fill("browser-password123")
    page.get_by_role("button", name="Создать аккаунт", exact=True).click()
    expect(page.get_by_role("alert")).to_contain_text("Этот логин уже занят")

    # Другой аккаунт не получает локальные данные предыдущего пользователя.
    second_username = "other_" + token_hex(4)
    page.get_by_label("Логин", exact=True).fill(second_username)
    page.get_by_role("button", name="Создать аккаунт", exact=True).click()
    expect(page.get_by_role("heading", name="Мои колоды", exact=True)).to_be_visible()
    expect(page.get_by_text("Только в этой сессии", exact=True)).to_have_count(0)

    # Недоступный сервер при восстановлении сессии даёт возможность повторить запрос.
    page.route("**/api/auth/refresh", lambda route: route.abort())
    page.reload()
    expect(page.get_by_text("Не удалось связаться с сервером", exact=True)).to_be_visible()
    page.unroute("**/api/auth/refresh")
    page.get_by_role("button", name="Повторить", exact=True).click()
    expect(page.get_by_role("heading", name="Мои колоды", exact=True)).to_be_visible()

    # Если refresh отозван, неудачное обновление очищает пользователя и закрывает страницу.
    assert page.request.post("http://127.0.0.1:5173/api/auth/logout").status == 204
    result = page.evaluate("""async () => {
        const moduleUrl = performance.getEntriesByType('resource')
            .find(entry => new URL(entry.name).pathname === '/src/shared/api/client.ts').name;
        const api = await import(moduleUrl);
        api.setAccessToken('expired-access-token');
        try { await api.apiRequest('/auth/me'); }
        catch (error) { return error.status; }
    }""")
    assert result == 401
    expect(page.get_by_role("heading", name="Вход", exact=True)).to_be_visible()

    page.get_by_label("Логин", exact=True).fill(username)
    page.get_by_label("Пароль", exact=True).fill("browser-password123")
    page.get_by_role("button", name="Войти", exact=True).click()
    expect(page.get_by_role("heading", name="Мои колоды", exact=True)).to_be_visible()
    page.get_by_role("link", name="Статистика", exact=True).click()
    expect(page.get_by_role("heading", name="Статистика", exact=True)).to_be_visible()
    refresh = next(cookie for cookie in page.context.cookies() if cookie["name"] == "refresh_token")
    assert refresh["httpOnly"] and refresh["sameSite"] == "Lax"
    page.reload()
    expect(page.get_by_role("heading", name="Статистика", exact=True)).to_be_visible()
    assert page.evaluate("Object.keys(localStorage).length") == 0

    page.get_by_role("button", name="Выйти", exact=True).click()
    expect(page.get_by_role("heading", name="Вход", exact=True)).to_be_visible()
    assert not any(cookie["name"] == "refresh_token" for cookie in page.context.cookies())
    response = page.request.post(
        "http://127.0.0.1:5173/api/auth/refresh",
        headers={"Cookie": "refresh_token=" + refresh["value"]},
    )
    assert response.status == 401

    page.get_by_label("Логин", exact=True).fill(username)
    page.get_by_label("Пароль", exact=True).fill("wrong-password")
    page.get_by_role("button", name="Войти", exact=True).click()
    expect(page.get_by_role("alert")).to_contain_text("Неверный логин или пароль")
    page.get_by_label("Пароль", exact=True).fill("browser-password123")
    page.get_by_role("button", name="Войти", exact=True).click()
    expect(page.get_by_role("heading", name="Статистика", exact=True)).to_be_visible()

    assert not errors, errors
    print("Пройдены: регистрация, вход, валидация, восстановление сессии, обновление access,")
    print("выход, отзыв refresh, смена аккаунта, обработка недоступного сервера. Ошибок JS нет.")
    browser.close()
