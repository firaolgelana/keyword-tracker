from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.infrastructure.database_repository import Repository
from app.services.keyword_research_service import KeywordResearchService

router = APIRouter()
repo = Repository()
service = KeywordResearchService(repo)

class SuggestRequest(BaseModel):
    seed: str
    limit: int = 10

@router.post("/suggest")
def suggest(req: SuggestRequest):
    if not req.seed or len(req.seed.strip()) == 0:
        raise HTTPException(status_code=400, detail="seed required")
    res = service.suggest_keywords(req.seed, limit=req.limit)
    # convert dataclass to dicts
    return [r.__dict__ for r in res]

@router.get("/list")
def list_keywords():
    kws = repo.list_keywords(limit=200)
    return [{"text": k.text, "estimated_volume": k.estimated_volume, "difficulty": k.difficulty, "created_at": k.created_at} for k in kws]
