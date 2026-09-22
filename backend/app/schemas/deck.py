from pydantic import BaseModel, ConfigDict, Field

from app.schemas.card import CardRead


class DeckBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=300)


class DeckCreate(DeckBase):
    pass


class DeckUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=300)


class DeckRead(DeckBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class DeckWithCards(DeckRead):
    cards: list[CardRead] = []
