from fastapi import HTTPException, Request, Depends
from spotipy.oauth2 import SpotifyOAuth
import spotipy
from time import time
from sqlmodel import Session, select

from app.core.config import settings
from app.core.database import get_db
from app.core.models import UserSession


class SpotifyClient:
    def __init__(self):
        self.oauth = SpotifyOAuth(
            client_id=settings.SPOTIFY_CLIENT_ID,
            client_secret=settings.SPOTIFY_CLIENT_SECRET,
            redirect_uri=settings.REDIRECT_URI,
            scope=" ".join([
                "user-read-recently-played",
                "user-read-currently-playing",
                "user-read-playback-state",
                "user-top-read",
                "user-read-private",
                "user-read-email",
                "user-library-read",
                "playlist-read-private",
                "playlist-read-collaborative",
            ])
        )

    def get_auth_url(self) -> str:
        return self.oauth.get_authorize_url()

    def get_token_info(self, code: str) -> dict:
        return self.oauth.get_access_token(code)

    def refresh_token(self, refresh_token: str) -> dict:
        return self.oauth.refresh_access_token(refresh_token)

    def get_client(self, access_token: str) -> spotipy.Spotify:
        return spotipy.Spotify(auth=access_token)


spotify_client = SpotifyClient()


async def get_spotify(request: Request, db: Session = Depends(get_db)) -> spotipy.Spotify:
    # First try to get session ID from header
    session_id = request.headers.get("X-Session-ID")

    # If no header, try to get from cookies
    if not session_id:
        session_id = request.cookies.get("session_id")

    if not session_id:
        raise HTTPException(status_code=401, detail="No session found. Please log in.")

    # Rest of the function remains the same
    stmt = select(UserSession).where(UserSession.id == session_id)
    session = db.exec(stmt).first()
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session ID")

    current_timestamp = int(time())
    if current_timestamp >= session.token_expires_at:
        token_info = spotify_client.refresh_token(session.refresh_token)
        session.access_token = token_info["access_token"]
        session.refresh_token = token_info.get("refresh_token", session.refresh_token)
        session.token_expires_at = current_timestamp + token_info["expires_in"]
        db.commit()
    return spotify_client.get_client(session.access_token)
