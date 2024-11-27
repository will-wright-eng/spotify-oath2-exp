# Spotify OAuth2 Project

A full-stack application demonstrating Spotify OAuth2 authentication flow with a FastAPI backend and Next.js frontend.

## Architecture

- **Frontend**: Next.js application with TypeScript and Tailwind CSS
- **Backend**: FastAPI Python application
- **Proxy**: Nginx serving as a reverse proxy
- **Database**: SQLite for session storage

## Prerequisites

- Docker and Docker Compose
- Make
- A Spotify Developer Account

## Setup Instructions

1. **Spotify Developer Setup**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Configure the following settings:
     - Website: `http://localhost:8000`
     - Redirect URI: `http://localhost:8000/auth/callback`
     - Required APIs: Web API, Web Playback SDK

2. **Environment Configuration**

   Backend:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your Spotify credentials:

   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

   Frontend:

   ```bash
   cd frontend
   cp env.local.example .env.local
   ```

3. **Build and Run**

   ```bash
   make up
   ```

## Project Structure

```
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── core/         # Core functionality
│   │   ├── routers/      # API endpoints
│   │   └── main.py       # Application entry point
│   └── tests/            # Backend tests
├── frontend/             # Next.js application
│   ├── app/              # Next.js pages and routes
│   ├── components/       # React components
│   └── lib/              # Utility functions
└── nginx/                # Nginx configuration
```

## API Endpoints

### Authentication

- `GET /auth/login` - Initiates Spotify OAuth2 flow
- `GET /auth/callback` - OAuth2 callback handler

### Spotify API

- `GET /spotify/me` - Get current user profile
- `GET /spotify/playlists` - Get user's playlists
- `GET /spotify/now-playing` - Get currently playing track
- `GET /spotify/recent-tracks` - Get recently played tracks

## Testing

### Testing the Auth Flow

1. Initialize the authentication:

```bash
curl http://localhost:8000/auth/login
```

2. Open the returned authorization URL in your browser and authorize the application

3. Verify session creation:

```bash
sqlite3 backend/spotify.db
sqlite> .tables
sqlite> select * from usersession;
```

4. Test the authenticated endpoints:

```bash
curl -H "X-Session-ID: <your_session_id>" http://localhost:8000/spotify/me
```

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## References

- [Spotify Web API Documentation](https://developer.spotify.com/)
- [Spotipy Python Library](https://github.com/spotipy-dev/spotipy)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
