from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from app.api import cards, decks
from app.api.errors import validation_error_handler

app = FastAPI(title="Flashcards API")

app.add_exception_handler(RequestValidationError, validation_error_handler)

app.include_router(decks.router)
app.include_router(cards.router)


@app.get("/health")
def health():
    return {"status": "ok"}
