from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr = Field(..., min_length=3, max_length=200)
    password: str = Field(min_length=8)

class UserLogin(BaseModel):
    email: EmailStr = Field(..., min_length=3, max_length=200)
    password: str = Field(min_length=8)
