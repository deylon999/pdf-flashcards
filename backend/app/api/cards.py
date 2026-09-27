from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.db.database import get_db
from app.schemas import CardCreate, CardRead

router = APIRouter(tags=["cards"])


@router.get("/decks/{deck_id}/cards", response_model=list[CardRead])
def read_cards(deck_id: int, db: Session = Depends(get_db)):
    if crud.get_deck(db, deck_id) is None:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    return crud.get_cards(db, deck_id)


@router.post("/decks/{deck_id}/cards", response_model=CardRead, status_code=201)
def create_card(deck_id: int, data: CardCreate, db: Session = Depends(get_db)):
    if crud.get_deck(db, deck_id) is None:
        raise HTTPException(status_code=404, detail="Колода не найдена")
    return crud.create_card(db, deck_id, data)
