from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.deck import Deck


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True)
    question: Mapped[str] = mapped_column(String(500))
    answer: Mapped[str] = mapped_column(String(500))
    learned: Mapped[bool] = mapped_column(default=False)
    deck_id: Mapped[int] = mapped_column(ForeignKey("decks.id", ondelete="CASCADE"))

    deck: Mapped["Deck"] = relationship(back_populates="cards")
