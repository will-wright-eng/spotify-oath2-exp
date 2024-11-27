from typing import List

from fastapi import Depends, APIRouter
import spotipy
from sqlmodel import select, Session
from app.core.spotify_client import get_spotify
from app.core.models import PlaylistCreate, User, UserSession
from app.core.database import get_db


router = APIRouter()


@router.get("/me")
async def get_current_user(sp: spotipy.Spotify = Depends(get_spotify)):
    return sp.current_user()


@router.get("/top-tracks")
async def get_top_tracks(
    time_range: str = "medium_term", limit: int = 20, sp: spotipy.Spotify = Depends(get_spotify)
):
    results = sp.current_user_top_tracks(limit=limit, offset=0, time_range=time_range)
    tracks = []
    for item in results["items"]:
        tracks.append(
            {
                "id": item["id"],
                "name": item["name"],
                "artist": item["artists"][0]["name"],
                "album": item["album"]["name"],
                "preview_url": item["preview_url"],
            }
        )
    return tracks


@router.get("/recently-played")
async def get_recently_played(limit: int = 20, sp: spotipy.Spotify = Depends(get_spotify)):
    results = sp.current_user_recently_played(limit=limit)
    tracks = []
    for item in results["items"]:
        track = item["track"]
        tracks.append(
            {
                "id": track["id"],
                "name": track["name"],
                "artist": track["artists"][0]["name"],
                "album": track["album"]["name"],
                "played_at": item["played_at"],
            }
        )
    return tracks


@router.post("/playlists")
async def create_playlist(playlist_data: PlaylistCreate, sp: spotipy.Spotify = Depends(get_spotify)):
    user_id = sp.current_user()["id"]
    result = sp.user_playlist_create(
        user_id, playlist_data.name, public=playlist_data.public, description=playlist_data.description
    )
    return result


@router.post("/playlists/{playlist_id}/tracks")
async def add_tracks_to_playlist(
    playlist_id: str, track_ids: List[str], sp: spotipy.Spotify = Depends(get_spotify)
):
    result = sp.playlist_add_items(playlist_id, track_ids)
    return result


@router.get("/debug/sessions")
async def get_debug_sessions(db: Session = Depends(get_db)):
    """Debug endpoint to get all user sessions. Do not use in production."""
    sessions = db.exec(
        select(UserSession)
        .join(User)
        .where(UserSession.user_id == User.id)
    ).all()

    return [{
        "session_id": session.id,
        "user_id": session.user_id,
        "spotify_id": session.user.spotify_id,
        "display_name": session.user.display_name,
        "expires_at": session.token_expires_at
    } for session in sessions]


@router.get("/playlists")
async def get_playlists(sp: spotipy.Spotify = Depends(get_spotify)):
    results = sp.current_user_playlists()
    return results
