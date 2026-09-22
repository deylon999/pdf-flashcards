from app.db.database import Base, engine
from app.models import Card, Deck


def main():
    Base.metadata.create_all(bind=engine)
    print("tables:", ", ".join(Base.metadata.tables))


if __name__ == "__main__":
    main()
