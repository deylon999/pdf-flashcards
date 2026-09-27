from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.db.database import get_db
from app.schemas import DeckRead, DeckWithCards

router = APIRouter(prefix="/decks", tags=["decks"])


@router.get("", response_model=list[DeckRead])
def read_decks(db: Session = Depends(get_db)):
    return crud.get_decks(db)


@router.get("/{deck_id}", response_model=DeckWithCards)
def read_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = crud.get_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    return deck
