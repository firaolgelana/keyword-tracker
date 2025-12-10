from app.infrastructure.scraper_google import get_autosuggests, get_search_results_count
from app.core.keyword import KeywordSuggestion
from app.infrastructure.database_repository import Repository
import math

class KeywordResearchService:
    def __init__(self, repo: Repository):
        self.repo = repo

    def suggest_keywords(self, seed: str, limit: int = 10):
        suggestions = get_autosuggests(seed, limit=limit)
        results = []
        for s in suggestions:
            # volume estimate based on search results count (rough)
            count = get_search_results_count(s) or 0
            # simple normalized estimate: log10-based bucket
            estimated_volume = int(math.log10(count + 1) * 1000) if count > 0 else 0
            # difficulty heuristic: higher result count -> higher difficulty
            difficulty = min(100, int(math.log10(count + 1) * 10)) if count > 0 else 10
            # opportunity label
            if estimated_volume > 2000 and difficulty < 40:
                opportunity = "high"
            elif estimated_volume > 500:
                opportunity = "medium"
            else:
                opportunity = "low"
            ks = KeywordSuggestion(keyword=s, estimated_volume=estimated_volume, difficulty=difficulty, opportunity=opportunity)
            results.append(ks)

            # optionally store (if not exists)
            existing = self.repo.get_keyword(s)
            if not existing:
                self.repo.create_keyword(s, estimated_volume, difficulty)
        return results
