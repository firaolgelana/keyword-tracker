from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.keyword_routes import router as keyword_router
from app.api.rank_routes import router as rank_router
from app.api.query_routes import router as query_router

app = FastAPI(
    title="SEO Keyword Research & Rank Tracker API",
    version="1.0.0"
)

from app.infrastructure.scheduler import start_scheduler

@app.on_event("startup")
def on_startup():
    start_scheduler()

import os
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://keyword-tracker-frontend.vercel.app/",
    "https://keyword-tracker-frontend.vercel.app"
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(keyword_router, prefix="/keywords", tags=["Keyword Research"])
app.include_router(rank_router, prefix="/rank", tags=["Rank Tracking"])
app.include_router(query_router, prefix="/queries", tags=["Query Management"])

@app.get("/")
def root():
    return {"message": "SEO Keyword & Rank Tracker API is running!"}

@app.post("/test-run-tracking")
def test_run_tracking():
    """Manually trigger rank tracking for all keywords (for testing)"""
    from app.services.rank_tracker_service import RankTrackerService
    from app.infrastructure.database_repository import Repository
    
    repo = Repository()
    service = RankTrackerService(repo)
    service.run_all_tracking_once()
    return {"message": "Rank tracking executed"}
