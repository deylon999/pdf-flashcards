from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.db.database import get_db
from app.schemas import CardCreate, CardRead, CardUpdate

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


@router.patch("/cards/{card_id}", response_model=CardRead)
def update_card(card_id: int, data: CardUpdate, db: Session = Depends(get_db)):
    card = crud.get_card(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Карточка не найдена")
    return crud.update_card(db, card, data)


@router.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    card = crud.get_card(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Карточка не найдена")
    crud.delete_card(db, card)
