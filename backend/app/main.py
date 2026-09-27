from fastapi import FastAPI

from app.api import decks

app = FastAPI(title="Flashcards API")

app.include_router(decks.router)


@app.get("/health")
def health():
    return {"status": "ok"}
