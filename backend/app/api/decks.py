from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.api.deps import get_deck_or_404
from app.db.database import get_db
from app.models import Deck
from app.schemas import DeckCreate, DeckRead, DeckUpdate, DeckWithCards

router = APIRouter(prefix="/decks", tags=["decks"])


@router.get("", response_model=list[DeckRead])
def read_decks(db: Session = Depends(get_db)):
    return crud.get_decks(db)


@router.post("", response_model=DeckRead, status_code=201)
def create_deck(data: DeckCreate, db: Session = Depends(get_db)):
    return crud.create_deck(db, data)


@router.get("/{deck_id}", response_model=DeckWithCards)
def read_deck(deck: Deck = Depends(get_deck_or_404)):
    return deck


@router.patch("/{deck_id}", response_model=DeckRead)
def update_deck(
    data: DeckUpdate,
    deck: Deck = Depends(get_deck_or_404),
    db: Session = Depends(get_db),
):
    return crud.update_deck(db, deck, data)


@router.delete("/{deck_id}", status_code=204)
def delete_deck(deck: Deck = Depends(get_deck_or_404), db: Session = Depends(get_db)):
    crud.delete_deck(db, deck)
