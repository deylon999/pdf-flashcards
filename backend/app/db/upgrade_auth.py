"""Добавляет владельцев к колодам, созданным до ЛР4, без удаления данных."""
import argparse

from sqlalchemy import inspect, text

from app.db.database import Base, engine
from app import models  # Регистрирует все таблицы в metadata.


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--owner", help="Логин владельца старых колод")
    args = parser.parse_args()
    Base.metadata.create_all(engine)
    with engine.begin() as connection:
        columns = {column["name"] for column in inspect(connection).get_columns("decks")}
        if "owner_id" not in columns:
            connection.execute(text(
                "ALTER TABLE decks ADD COLUMN owner_id INTEGER REFERENCES users(id)"
            ))
        count = connection.scalar(text("SELECT count(*) FROM decks WHERE owner_id IS NULL"))
        if count:
            owner_id = connection.scalar(
                text("SELECT id FROM users WHERE username = :username"),
                {"username": args.owner},
            )
            if owner_id is None:
                raise SystemExit(
                    "Есть старые колоды. Зарегистрируйтесь и повторите с --owner ВАШ_ЛОГИН"
                )
            connection.execute(
                text("UPDATE decks SET owner_id = :owner_id WHERE owner_id IS NULL"),
                {"owner_id": owner_id},
            )
        connection.execute(text("ALTER TABLE decks ALTER COLUMN owner_id SET NOT NULL"))
        connection.execute(text("CREATE INDEX IF NOT EXISTS ix_decks_owner_id ON decks(owner_id)"))
    print("Схема обновлена. Старых колод с назначенным владельцем:", count)


if __name__ == "__main__":
    main()
