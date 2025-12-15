from app.infrastructure.scraper_google import get_serp_positions, get_serpapi_positions
from app.infrastructure.database_repository import Repository
from typing import Optional
import os

class RankTrackerService:
    def __init__(self, repo: Repository, scraper=None):
        self.repo = repo
        # Use SerpApi by default
        self.scraper = scraper or get_serpapi_positions

    def add_tracking(self, domain: str, keyword: str, frequency: str="daily"):
        return self.repo.add_tracking_keyword(domain=domain, keyword=keyword, frequency=frequency)

    def delete_tracking(self, tracking_id: int):
        return self.repo.delete_tracking(tracking_id)

    def update_tracking(self, tracking_id: int, domain: str, keyword: str, frequency: str):
        return self.repo.update_tracking(tracking_id, domain, keyword, frequency)

    def check_rank_once(self, tracking):
        keyword = tracking.keyword
        domain = tracking.domain
        res = self.scraper(keyword, domain, max_pages=3)
        pos = res.get("position")
        
        # Check if we got an error message from scraper
        error_msg = res.get("error")
        
        import json
        if error_msg:
            # Store the error in the snapshot field so user can see it
            snapshot = json.dumps({"error": error_msg})
        else:
            snapshot = json.dumps(res.get("items", [])[:10])
            
        self.repo.add_rank_history(tracking.id, pos, snapshot)
        return pos

    def run_all_tracking_once(self):
        all_tracking = self.repo.list_tracking()
        from datetime import datetime, timedelta
        
        for t in all_tracking:
            try:
                # Check if due based on frequency
                should_run = False
                histories = self.repo.get_rank_history_for(t.id, limit=1)
                last_run = histories[0].checked_at if histories else None
                
                if not last_run:
                    should_run = True
                else:
                    now = datetime.now(last_run.tzinfo)
                    delta = now - last_run
                    
                    freq = (t.frequency or "daily").lower()
                    
                    if freq == "minutely":
                        should_run = delta >= timedelta(minutes=1)
                    elif freq == "hourly":
                        should_run = delta >= timedelta(hours=1)
                    elif freq == "daily":
                        should_run = delta >= timedelta(days=1)
                    elif freq == "weekly":
                        should_run = delta >= timedelta(weeks=1)
                    elif freq == "monthly":
                        should_run = delta >= timedelta(days=30)
                    else:
                        # Default to daily
                        should_run = delta >= timedelta(days=1)

                if should_run:
                    self.check_rank_once(t)
            except Exception as e:
                # continue tracking others even if one fails
                print(f"Error checking rank for {t.keyword}: {e}")
                continue

    def cleanup_history(self, days: int = 7):
        count = self.repo.delete_old_history(days)
        print(f"Cleaned up {count} old history records (older than {days} days)")
        return count
