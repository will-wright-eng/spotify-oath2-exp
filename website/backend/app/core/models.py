from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel
import time


class UserBase(SQLModel):
    spotify_id: str = Field(unique=True, index=True)
    email: Optional[str] = None
    display_name: Optional[str] = None


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: int = Field(default_factory=lambda: int(time.time()))
    sessions: List["UserSession"] = Relationship(back_populates="user")


class UserSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    access_token: str
    refresh_token: str
    token_expires_at: int
    created_at: int = Field(default_factory=lambda: int(time.time()))
    user: User = Relationship(back_populates="sessions")


# Models
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str


class Track(BaseModel):
    id: str
    name: str
    artist: str
    album: str
    preview_url: Optional[str]


class PlaylistCreate(BaseModel):
    name: str
    description: Optional[str] = None
    public: bool = True
