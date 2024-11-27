from unittest.mock import Mock, patch

import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import get_db
from app.core.spotify_client import spotify_client


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_login(client):
    with patch.object(spotify_client, "get_auth_url") as mock_auth_url:
        mock_auth_url.return_value = "https://accounts.spotify.com/authorize"
        response = client.get("/auth/login")
        assert response.status_code == 200
        assert "auth_url" in response.json()


def test_callback_success(client, session):
    # Mock token response
    mock_token_info = {"access_token": "mock_access_token", "refresh_token": "mock_refresh_token", "expires_in": 3600}
    # Mock Spotify user response
    mock_spotify_user = {"id": "spotify_user_123", "email": "test@example.com", "display_name": "Test User"}
    with patch.object(spotify_client, "get_token_info") as mock_get_token, patch.object(
        spotify_client, "get_client"
    ) as mock_get_client:
        mock_get_token.return_value = mock_token_info
        mock_spotify = Mock()
        mock_spotify.current_user.return_value = mock_spotify_user
        mock_get_client.return_value = mock_spotify
        response = client.get("/auth/callback?code=test_code")
        assert response.status_code == 200
        data = response.json()
        assert "session_id" in data
        assert "user" in data
        assert data["user"]["spotify_id"] == mock_spotify_user["id"]
