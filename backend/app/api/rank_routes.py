from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.infrastructure.database_repository import Repository
from app.services.rank_tracker_service import RankTrackerService

router = APIRouter()
repo = Repository()
service = RankTrackerService(repo)

class TrackRequest(BaseModel):
    domain: str
    keyword: str
    frequency: str = "daily"

@router.post("/track")
def add_tracking(req: TrackRequest):
    if not req.domain or not req.keyword:
        raise HTTPException(status_code=400, detail="domain and keyword required")
    tk = service.add_tracking(req.domain, req.keyword, req.frequency)
    return {"id": tk.id, "domain": tk.domain, "keyword": tk.keyword, "frequency": tk.frequency}

@router.get("/history/{tracking_id}")
def history(tracking_id: int):
    tk = repo.get_tracking_by_id(tracking_id)
    if not tk:
        raise HTTPException(status_code=404, detail="tracking not found")
    histories = repo.get_rank_history_for(tracking_id, limit=200)
    return [{"position": h.position, "checked_at": h.checked_at, "serp_snapshot": h.serp_snapshot} for h in histories]
