from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class CustomerBase(BaseModel):
    primary_email: Optional[EmailStr] = Field(None, max_length=255)
    primary_phone: Optional[str] = Field(None, max_length=50)
    name: Optional[str] = Field(None, max_length=255)
    consent_flags: Optional[Dict[str, Any]] = Field(default_factory=dict)

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    primary_email: Optional[EmailStr] = Field(None, max_length=255)
    primary_phone: Optional[str] = Field(None, max_length=50)
    name: Optional[str] = Field(None, max_length=255)
    consent_flags: Optional[Dict[str, Any]] = None

class CustomerResponse(CustomerBase):
    id: str
    class Config:
        from_attributes = True
