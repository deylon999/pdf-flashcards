from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.db.database import get_db
from app.models import Card, Deck


def get_deck_or_404(deck_id: int, db: Session = Depends(get_db)) -> Deck:
    deck = crud.get_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    return deck


def get_card_or_404(card_id: int, db: Session = Depends(get_db)) -> Card:
    card = crud.get_card(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Карточка не найдена")
    return card
