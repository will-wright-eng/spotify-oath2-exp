import os
from functools import lru_cache


class Settings:
    PROJECT_NAME: str = "spotipy-backend"
    DATABASE_URI: str = os.getenv("DATABASE_URI")
    SPOTIFY_CLIENT_ID: str = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: str = os.getenv("SPOTIFY_CLIENT_SECRET")
    REDIRECT_URI: str = os.getenv("REDIRECT_URI")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT")
    DROP_ALL_TABLES: bool = os.getenv("DROP_ALL_TABLES", "true").lower() == "true"

    def __init__(self):
        if self.DATABASE_URI is None:
            raise ValueError("Missing required environment variable: DATABASE_URI")

        spotify_vars = {
            "SPOTIFY_CLIENT_ID": self.SPOTIFY_CLIENT_ID,
            "SPOTIFY_CLIENT_SECRET": self.SPOTIFY_CLIENT_SECRET,
            "REDIRECT_URI": self.REDIRECT_URI,
        }
        missing_vars = [k for k, v in spotify_vars.items() if v is None]
        if missing_vars:
            raise ValueError(f"Missing required Spotify environment variables: {', '.join(missing_vars)}")


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
