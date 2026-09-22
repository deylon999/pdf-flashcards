from pydantic import BaseModel, ConfigDict, Field


class CardBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    question: str = Field(min_length=1, max_length=500)
    answer: str = Field(min_length=1, max_length=500)


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    question: str | None = Field(default=None, min_length=1, max_length=500)
    answer: str | None = Field(default=None, min_length=1, max_length=500)
    learned: bool | None = None


class CardRead(CardBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    learned: bool
    deck_id: int
