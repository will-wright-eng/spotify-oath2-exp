from fastapi import FastAPI, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, sqlite, spotify
from app.core.config import settings
from app.core.logger import log
from app.core.database import create_db_and_tables

app = FastAPI(title=settings.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    log.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    log.info(f"Response: {response.status_code}")
    return response


@app.on_event("startup")
async def startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/favicon.ico")
async def favicon():
    return Response(status_code=204)


# Endpoints
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(sqlite.router, prefix="/sqlite", tags=["sqlite"])
app.include_router(spotify.router, prefix="/spotify", tags=["spotify"])
