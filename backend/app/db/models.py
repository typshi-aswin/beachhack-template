from datetime import datetime

from sqlalchemy import Column, TIMESTAMP, JSON, ForeignKey, String
from sqlmodel import Field, Relationship

from app.db.base_db import CustomBaseModel, BaseCreatorModel, BaseUpdaterModel
from app.util.date_util import DateUtil


class User(CustomBaseModel, table=True):
    __tablename__ = 'user'
    email: str = Field(nullable=False, unique=True, max_length=200)
    username: str = Field(default=None, nullable=False, max_length=100)
    password_hash: str  = Field(default=None, nullable=False)
    created_at: datetime = Field(
        sa_column=Column(TIMESTAMP(timezone=True), default=DateUtil.get_current_time))