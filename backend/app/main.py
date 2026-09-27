from fastapi import FastAPI

from app.api import cards, decks

app = FastAPI(title="Flashcards API")

app.include_router(decks.router)
app.include_router(cards.router)


@app.get("/health")
def health():
    return {"status": "ok"}
