from datetime import datetime, timedelta, timezone
from secrets import token_urlsafe

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_token
from app.models import RefreshSession


def create_refresh_session(db: Session, user_id: int) -> str:
    token = token_urlsafe(48)
    session = RefreshSession(
        token_hash=hash_token(token),
        user_id=user_id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_days),
    )
    db.add(session)
    db.commit()
    return token


def get_refresh_session(db: Session, token: str) -> RefreshSession | None:
    return db.scalar(select(RefreshSession).where(RefreshSession.token_hash == hash_token(token)))
