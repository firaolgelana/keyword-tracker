from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.infrastructure.database_repository import Repository
import datetime

router = APIRouter()
repo = Repository()

class AddQueryRequest(BaseModel):
    query: str
    location: str = "Global"
    results_count: str = "0"

@router.post("/add")
def add_query(req: AddQueryRequest):
    if not req.query:
        raise HTTPException(status_code=400, detail="query required")
    # For now, default location/results logic is handled by client or here
    rq = repo.add_recent_query(req.query, req.location, req.results_count)
    return {"id": rq.id, "query": rq.query}

@router.get("/recent")
def get_recent():
    queries = repo.get_recent_queries(limit=5)
    
    
    # helper to format "X min ago"
    def format_time(dt):
        if dt.tzinfo is None:
            # If naive, assume UTC because that's what we likely stored
            dt = dt.replace(tzinfo=datetime.timezone.utc)
        
        now = datetime.datetime.now(datetime.timezone.utc)
        diff = now - dt
        minutes = int(diff.total_seconds() / 60)
        
        if minutes < 1:
            return "Just now"
        if minutes < 60:
            return f"{minutes} min ago"
        hours = int(minutes / 60)
        if hours < 24:
            return f"{hours}h ago"
        days = int(hours / 24)
        return f"{days}d ago"

    return [{
        "id": q.id,
        "query": q.query,
        "location": q.location,
        "time": format_time(q.created_at),
        "results": q.results_count
    } for q in queries]
