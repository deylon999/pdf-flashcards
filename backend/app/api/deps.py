from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api.current_user import get_current_user
from app.db.database import get_db
from app.models import Card, Deck, User


def get_deck_or_404(
    deck_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user),
) -> Deck:
    deck = crud.get_deck(db, deck_id)
    if deck is None or deck.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    return deck


def get_card_or_404(
    card_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user),
) -> Card:
    card = crud.get_card(db, card_id)
    if card is None or card.deck.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Карточка не найдена")
    return card
