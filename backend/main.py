# main.py
from fastapi import FastAPI
from app.api import keyword_routes, rank_routes

# Initialize the application
app = FastAPI(
    title="Keyword Ranker Project",
    version="1.0.0",
    description="A simple Keyword Research and Rank Tracking tool."
)

# 1. Include the API Routes
app.include_router(keyword_routes.router, prefix="/api/v1/keywords", tags=["Keyword Research"])
app.include_router(rank_routes.router, prefix="/api/v1/rank", tags=["Rank Tracking"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Keyword Ranker API"}

# To run the app (later): uvicorn main:app --reloa