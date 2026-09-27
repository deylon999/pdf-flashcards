from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Deck
from app.schemas import DeckCreate


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
