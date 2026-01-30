from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import Column, JSON, TIMESTAMP, func
from sqlmodel import Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB

from app.db.base_db import CustomBaseModel, BaseCreatorModel
from app.util.date_util import DateUtil
from app.util.types import InteractionStatus


class User(CustomBaseModel, table=True):
    __tablename__ = 'user'
    email: str = Field(nullable=False, unique=True, max_length=200)
    username: str = Field(default=None, nullable=False, max_length=100)
    password_hash: str = Field(default=None, nullable=False)

    created_at: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), default=DateUtil.get_current_time)
    )


class Customer(CustomBaseModel, table=True):
    __tablename__ = 'customers'
    primary_email: Optional[str] = Field(max_length=255, index=True)
    primary_phone: Optional[str] = Field(max_length=50, index=True)
    name: Optional[str] = Field(max_length=255)
    last_interaction_at: Optional[datetime]
    consent_flags: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))

    interactions: List["Interaction"] = Relationship(back_populates="customer")
    memory_items: List["MemoryItem"] = Relationship(back_populates="customer")
    actions: List["Action"] = Relationship(back_populates="customer")


class Interaction(CustomBaseModel, table=True):
    __tablename__ = "interactions"
    customer_id: str = Field(foreign_key="customers.id", nullable=False, index=True)
    channel: str = Field(max_length=50, nullable=False)
    raw_text: Optional[str]
    audio_s3_key: Optional[str] = Field(max_length=500)
    meta_data: Optional[Dict[str, Any]] = Field(sa_column=Column(JSONB))
    nlp_output: Optional[Dict[str, Any]] = Field(sa_column=Column(JSONB))
    created_at: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    )
    status: str = Field(default=InteractionStatus.PENDING.value, max_length=50, index=True)

    customer: Customer = Relationship(back_populates="interactions")
    memory_items: List["MemoryItem"] = Relationship(back_populates="source_interaction")
    actions: List["Action"] = Relationship(back_populates="interaction")


class MemoryItem(CustomBaseModel, table=True):
    __tablename__ = "memory_items"
    customer_id: str = Field(foreign_key="customers.id", nullable=False, index=True)
    type: str = Field(max_length=50, nullable=False)
    key: str = Field(max_length=255, nullable=False, index=True)
    value: str = Field(nullable=False)
    confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    source_interaction_id: Optional[str] = Field(foreign_key="interactions.id")
    source_type: Optional[str] = Field(max_length=50)
    evidence: Dict[str, Any] = Field(sa_column=Column(JSONB, nullable=False))
    first_seen: datetime = Field(nullable=False)
    last_seen: datetime = Field(nullable=False)
    is_active: bool = Field(default=True)
    version: int = Field(default=1)

    customer: Customer = Relationship(back_populates="memory_items")
    source_interaction: Optional[Interaction] = Relationship(back_populates="memory_items")


class Action(CustomBaseModel, table=True):
    __tablename__ = "actions"
    customer_id: Optional[str] = Field(foreign_key="customers.id")
    interaction_id: Optional[str] = Field(foreign_key="interactions.id")
    action_type: str = Field(max_length=100, nullable=False, index=True)
    params: Optional[Dict[str, Any]] = Field(sa_column=Column(JSONB))
    status: str = Field(default=InteractionStatus.PENDING.value, max_length=50, index=True)
    executed_at: Optional[datetime]
    created_at: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    )

    customer: Optional[Customer] = Relationship(back_populates="actions")
    interaction: Optional[Interaction] = Relationship(back_populates="actions")