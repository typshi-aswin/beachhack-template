from pydantic import BaseModel, Field
from typing import Optional

class NoteCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    content: Optional[str] = Field(None)

class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    content: Optional[str] = Field(None)
    is_public: Optional[bool] = Field(None)