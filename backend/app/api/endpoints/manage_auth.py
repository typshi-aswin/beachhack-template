from fastapi import APIRouter
from sqlalchemy.sql import select
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

from app.db.models import User
from app.util.hashing_util import Hash
from app.util.jwt_util import JWTUtil
from app.api.deps import SessionDep, CurrentUserDep, PayloadDep
from app.core.exception_handler import ExceptionLoggingRoute
from app.core.config import settings
from app.util.response import CustomResponse
from app.schemas.auth import UserRegister, UserLogin

router = APIRouter(route_class=ExceptionLoggingRoute)


@router.post('/register/')
async def register(body: PayloadDep, db: SessionDep):
    try:
        data = UserRegister(**body)
    except ValidationError as e:
        raise RequestValidationError(e.errors(), body=body)

    email = data.email
    password = data.password

    if (await db.scalar(select(User).filter(User.email == email))):
        return CustomResponse(general_message="Email already exist.").get_failure_response()

    user = User(
        email=email,
        username=email.split('@')[0],
        password_hash=Hash.encrypt_password(password) if password else None
    )
    user_access_token = JWTUtil.create_access_token({"id": user.id})
    user_refresh_token = JWTUtil.create_refresh_token({"id": user.id})
    user_response = {
        "id": user.id,
        "name": user.username,
        "email": user.email,
        "access_token_expiry": settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        "access_token": user_access_token,
        "refresh_token_expiry": settings.REFRESH_TOKEN_EXPIRE_MINUTES,
        "refresh_token": user_refresh_token,
    }
    db.add(user)
    await db.commit()
    return CustomResponse(
        general_message="User successfully registered.",
        response=user_response
    ).get_success_response()


@router.post('/login/')
async def login(body: PayloadDep, db: SessionDep):
    try:
        data = UserLogin(**body)
    except ValidationError as e:
        raise RequestValidationError(e.errors(), body=body)

    email = data.email
    password = data.password

    if not (user := (await db.scalar(select(User).filter(User.email == email)))):
        return CustomResponse(general_message="User not found.").get_failure_response()
    
    if not Hash.verify_password(password, user.password_hash):
        return CustomResponse(general_message="Invalid password.").get_failure_response()

    user_access_token = JWTUtil.create_access_token({"id": user.id})
    user_refresh_token = JWTUtil.create_refresh_token({"id": user.id})
    return CustomResponse(
        general_message="User login success.",
        response={
            "id": user.id,
            "name": user.username,
            "email": user.email,
            "access_token": user_access_token,
            "access_token_expiry": settings.ACCESS_TOKEN_EXPIRE_MINUTES,
            "refresh_token": user_refresh_token,
            "refresh_token_expiry": settings.REFRESH_TOKEN_EXPIRE_MINUTES
    }).get_success_response()


@router.get('/get-access-token/')
async def get_access_token(db: SessionDep, current_user: CurrentUserDep):
    user_id = current_user.get('id')
    if not (await db.scalar(select(User).filter(User.id == user_id))):
        return CustomResponse(general_message="User not found.").get_failure_response()

    user_access_token = JWTUtil.create_access_token({"id": user_id})
    return CustomResponse(response={
        "access_token": user_access_token,
        "access_token_expiry": settings.ACCESS_TOKEN_EXPIRE_MINUTES
    }).get_success_response()