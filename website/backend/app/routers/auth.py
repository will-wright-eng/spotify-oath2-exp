from time import time
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from fastapi.responses import JSONResponse, RedirectResponse
import webbrowser

from app.core.models import User, UserSession
from app.core.database import get_db
from app.core.spotify_client import spotify_client
from app.core.logger import log

router = APIRouter()


@router.get("/login")
async def login():
    """Get Spotify authorization URL and open it in default browser"""
    log.info("Generating Spotify authorization URL")
    auth_url = spotify_client.get_auth_url()
    log.debug(f"Generated auth URL: {auth_url}")
    return {"auth_url": auth_url}


@router.get("/callback")
async def callback(code: str, db: Session = Depends(get_db)):
    """Handle Spotify OAuth callback"""
    try:
        log.info("Processing Spotify OAuth callback")
        # Get tokens from Spotify
        log.debug("Requesting token info from Spotify")
        token_info = spotify_client.get_token_info(code)

        # Get user info using the access token
        log.debug("Fetching user info from Spotify")
        sp = spotify_client.get_client(token_info["access_token"])
        spotify_user = sp.current_user()

        # Find or create user
        log.debug(f"Looking up user with Spotify ID: {spotify_user['id']}")
        user_query = select(User).where(User.spotify_id == spotify_user["id"])
        db_user = db.exec(user_query).first()
        if not db_user:
            log.info(f"Creating new user for Spotify ID: {spotify_user['id']}")
            db_user = User(
                spotify_id=spotify_user["id"],
                email=spotify_user.get("email"),
                display_name=spotify_user.get("display_name"),
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        # Create new session
        log.debug(f"Creating new session for user ID: {db_user.id}")
        current_timestamp = int(time())
        user_session = UserSession(
            user_id=db_user.id,
            access_token=token_info["access_token"],
            refresh_token=token_info["refresh_token"],
            token_expires_at=current_timestamp + token_info["expires_in"],
        )
        db.add(user_session)
        db.commit()
        db.refresh(user_session)

        log.info(f"Successfully created session {user_session.id} for user {db_user.id}")
        # Create the response data
        response_data = {
            "session_id": str(user_session.id),
            "user_id": str(db_user.id),
            "spotify_id": db_user.spotify_id,
            "display_name": db_user.display_name
        }

        # Create URL-safe parameters
        params = "&".join([f"{key}={value}" for key, value in response_data.items()])
        redirect_url = f"http://localhost:3000/auth/callback?{params}"

        response = RedirectResponse(url=redirect_url)

        # Set the session cookie
        response.set_cookie(
            key="session_id",
            value=str(user_session.id),
            httponly=True,  # Makes cookie inaccessible to JavaScript
            secure=True,    # Only send cookie over HTTPS
            samesite="lax", # Provides some CSRF protection
            max_age=3600 * 24 * 30  # 30 days in seconds
        )

        return response
    except Exception as e:
        log.error(f"Error during OAuth callback: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))
