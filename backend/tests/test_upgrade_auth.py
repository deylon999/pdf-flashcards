import os
import sys

import pytest
from sqlalchemy import inspect, text

from app.core.security import hash_password
from app.db import upgrade_auth


@pytest.mark.skipif(not os.environ.get("TEST_DATABASE_URL"), reason="Нужна тестовая PostgreSQL")
def test_upgrade_preserves_old_decks_and_cards(db, monkeypatch):
    engine = db.get_bind()
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE decks DROP COLUMN owner_id"))
        connection.execute(text(
            "INSERT INTO decks (id, title, description) VALUES (10, 'Old deck', 'Keep me')"
        ))
        connection.execute(text(
            "INSERT INTO cards (id, question, answer, learned, deck_id) "
            "VALUES (20, 'Question', 'Answer', false, 10)"
        ))
        connection.execute(text(
            "INSERT INTO users (id, username, password_hash) VALUES (1, 'student', :password)"
        ), {"password": hash_password("password123")})
    monkeypatch.setattr(upgrade_auth, "engine", engine)
    monkeypatch.setattr(sys, "argv", ["upgrade_auth"])
    with pytest.raises(SystemExit, match="--owner"):
        upgrade_auth.main()
    # Неудачная попытка откатывает ALTER TABLE и не затрагивает данные.
    assert "owner_id" not in {column["name"] for column in inspect(engine).get_columns("decks")}
    monkeypatch.setattr(sys, "argv", ["upgrade_auth", "--owner", "student"])
    upgrade_auth.main()
    upgrade_auth.main()  # Повторный запуск безопасен.
    with engine.connect() as connection:
        assert connection.execute(text("SELECT title, owner_id FROM decks")).one() == ("Old deck", 1)
        assert connection.execute(text("SELECT question, deck_id FROM cards")).one() == ("Question", 10)
    owner_column = next(column for column in inspect(engine).get_columns("decks") if column["name"] == "owner_id")
    assert owner_column["nullable"] is False
