from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Deck
from app.schemas import DeckCreate, DeckUpdate


def get_decks(db: Session) -> list[Deck]:
    return list(db.scalars(select(Deck).order_by(Deck.id)))


def get_deck(db: Session, deck_id: int) -> Deck | None:
    return db.get(Deck, deck_id)


def create_deck(db: Session, data: DeckCreate) -> Deck:
    deck = Deck(**data.model_dump())
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return deck


def update_deck(db: Session, deck: Deck, data: DeckUpdate) -> Deck:
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(deck, key, value)
    db.commit()
    db.refresh(deck)
    return deck


def delete_deck(db: Session, deck: Deck) -> None:
    db.delete(deck)
    db.commit()
