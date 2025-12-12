from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.keyword_routes import router as keyword_router
from app.api.rank_routes import router as rank_router  

app = FastAPI(
    title="SEO Keyword Research & Rank Tracker API",
    version="1.0.0"
)

from app.infrastructure.scheduler import start_scheduler

@app.on_event("startup")
def on_startup():
    start_scheduler()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(keyword_router, prefix="/keywords", tags=["Keyword Research"])
app.include_router(rank_router, prefix="/rank", tags=["Rank Tracking"])

@app.get("/")
def root():
    return {"message": "SEO Keyword & Rank Tracker API is running!"}
