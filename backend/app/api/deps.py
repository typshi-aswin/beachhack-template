from typing import Annotated, AsyncGenerator
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.engine import engine
from app.util.security import JWTUtils
from app.util.form_util import FormUtil


async def get_db() -> AsyncGenerator:
    async with AsyncSession(engine) as session:
        try:
            yield session
        finally:
            await session.close()


async def get_body(request: Request) -> dict:
    content_type = request.headers.get("Content-Type", "")
    if "application/json" in content_type:
        try:
            return await request.json()
        except Exception:
            return {}
    try:
        return FormUtil.form_to_dict(await request.form())
    except Exception:
        return {}


SessionDep = Annotated[AsyncSession, Depends(get_db)]
CurrentUserDep = Annotated[dict, Depends(JWTUtils.get_current_user)]
PayloadDep = Annotated[dict, Depends(get_body)]
