from fastapi import FastAPI
from app.api.keyword_routes import router as keyword_router
from app.api.rank_routes import router as rank_router  

app = FastAPI(
    title="SEO Keyword Research & Rank Tracker API",
    version="1.0.0"
)

app.include_router(keyword_router, prefix="/keywords", tags=["Keyword Research"])
app.include_router(rank_router, prefix="/rank", tags=["Rank Tracking"])

@app.get("/")
def root():
    return {"message": "SEO Keyword & Rank Tracker API is running!"}
