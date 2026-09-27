from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Card
from app.schemas import CardCreate


def get_cards(db: Session, deck_id: int) -> list[Card]:
    query = select(Card).where(Card.deck_id == deck_id).order_by(Card.id)
    return list(db.scalars(query))


def get_card(db: Session, card_id: int) -> Card | None:
    return db.get(Card, card_id)


def create_card(db: Session, deck_id: int, data: CardCreate) -> Card:
    card = Card(**data.model_dump(), deck_id=deck_id)
    db.add(card)
    db.commit()
    db.refresh(card)
    return card
