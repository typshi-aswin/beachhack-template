from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/")
async def common():
    return {"message": "First api endpoint."}


@router.get("/health/")
async def common():
    return {"message": "✅ Server is healthy and running 🚀"}