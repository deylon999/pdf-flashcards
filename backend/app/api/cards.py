from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.api.deps import get_card_or_404, get_deck_or_404
from app.db.database import get_db
from app.models import Card, Deck
from app.schemas import CardCreate, CardRead, CardUpdate

router = APIRouter(tags=["cards"])


@router.get("/decks/{deck_id}/cards", response_model=list[CardRead])
def read_cards(deck: Deck = Depends(get_deck_or_404), db: Session = Depends(get_db)):
    return crud.get_cards(db, deck.id)


@router.post("/decks/{deck_id}/cards", response_model=CardRead, status_code=201)
def create_card(
    data: CardCreate,
    deck: Deck = Depends(get_deck_or_404),
    db: Session = Depends(get_db),
):
    return crud.create_card(db, deck.id, data)


@router.patch("/cards/{card_id}", response_model=CardRead)
def update_card(
    data: CardUpdate,
    card: Card = Depends(get_card_or_404),
    db: Session = Depends(get_db),
):
    return crud.update_card(db, card, data)


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card: Card = Depends(get_card_or_404), db: Session = Depends(get_db)):
    crud.delete_card(db, card)
