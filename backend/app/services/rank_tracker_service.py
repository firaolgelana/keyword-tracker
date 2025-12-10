from app.infrastructure.scraper_google import get_serp_positions
from app.infrastructure.database_repository import Repository
from typing import Optional

class RankTrackerService:
    def __init__(self, repo: Repository, scraper=None):
        self.repo = repo
        self.scraper = scraper or get_serp_positions

    def add_tracking(self, domain: str, keyword: str, frequency: str="daily"):
        return self.repo.add_tracking_keyword(domain=domain, keyword=keyword, frequency=frequency)

    def check_rank_once(self, tracking):
        keyword = tracking.keyword
        domain = tracking.domain
        res = self.scraper(keyword, domain, max_pages=3)
        pos = res.get("position")
        import json
        snapshot = json.dumps(res.get("items", [])[:10])
        self.repo.add_rank_history(tracking.id, pos, snapshot)
        return pos

    def run_all_tracking_once(self):
        all_tracking = self.repo.list_tracking()
        for t in all_tracking:
            try:
                self.check_rank_once(t)
            except Exception:
                # continue tracking others even if one fails
                continue
