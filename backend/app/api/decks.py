from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.db.database import get_db
from app.schemas import DeckCreate, DeckRead, DeckUpdate, DeckWithCards

router = APIRouter(prefix="/decks", tags=["decks"])


@router.get("", response_model=list[DeckRead])
def read_decks(db: Session = Depends(get_db)):
    return crud.get_decks(db)


@router.post("", response_model=DeckRead, status_code=201)
def create_deck(data: DeckCreate, db: Session = Depends(get_db)):
    return crud.create_deck(db, data)


@router.get("/{deck_id}", response_model=DeckWithCards)
def read_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = crud.get_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    return deck


@router.patch("/{deck_id}", response_model=DeckRead)
def update_deck(deck_id: int, data: DeckUpdate, db: Session = Depends(get_db)):
    deck = crud.get_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    return crud.update_deck(db, deck, data)


@router.delete("/{deck_id}", status_code=204)
def delete_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = crud.get_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    crud.delete_deck(db, deck)
