from datetime import datetime, timezone

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.current_user import get_current_user
from app.core.config import settings
from app.core.security import create_access_token, dummy_hash, verify_password
from app.crud.refresh_session import create_refresh_session, get_refresh_session
from app.crud.user import create_user, get_user_by_username
from app.db.database import get_db
from app.models import User
from app.schemas.auth import AccessToken, Credentials, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=201)
def register(data: Credentials, db: Session = Depends(get_db)):
    try:
        return create_user(db, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Этот логин уже занят")


@router.post("/login", response_model=AccessToken)
def login(data: Credentials, response: Response, db: Session = Depends(get_db)):
    user = get_user_by_username(db, data.username)
    valid = verify_password(data.password, user.password_hash if user else dummy_hash)
    if user is None or not valid:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    refresh_token = create_refresh_session(db, user.id)
    response.set_cookie(
        "refresh_token", refresh_token, httponly=True, secure=settings.cookie_secure,
        samesite="lax", path="/", max_age=settings.refresh_token_days * 86400,
    )
    return AccessToken(access_token=create_access_token(user.id))


@router.post("/refresh", response_model=AccessToken)
def refresh(refresh_token: str | None = Cookie(default=None), db: Session = Depends(get_db)):
    session = get_refresh_session(db, refresh_token) if refresh_token else None
    if session is None or session.revoked:
        raise HTTPException(status_code=401, detail="Сессия недействительна. Войдите снова")
    # SQLite в тестах возвращает время без часового пояса; в PostgreSQL колонка timezone-aware.
    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= datetime.now(timezone.utc) or db.get(User, session.user_id) is None:
        raise HTTPException(status_code=401, detail="Сессия истекла. Войдите снова")
    return AccessToken(access_token=create_access_token(session.user_id))


@router.post("/logout", status_code=204)
def logout(
    response: Response, refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    session = get_refresh_session(db, refresh_token) if refresh_token else None
    if session is not None:
        session.revoked = True
        db.commit()
    response.delete_cookie(
        "refresh_token", path="/", secure=settings.cookie_secure, httponly=True, samesite="lax",
    )


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return user
