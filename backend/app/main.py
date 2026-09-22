from fastapi import FastAPI

app = FastAPI(title="Flashcards API")


@app.get("/health")
def health():
    return {"status": "ok"}
