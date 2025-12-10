from apscheduler.schedulers.background import BackgroundScheduler
from app.services.rank_tracker_service import RankTrackerService
from app.infrastructure.database_repository import Repository
import logging

logger = logging.getLogger(__name__)

_scheduler = None

def _job_run_all_tracking():
    repo = Repository()
    service = RankTrackerService(repo, None)  # service: repo + scraper (service will import scraper internally)
    try:
        service.run_all_tracking_once()
    except Exception as e:
        logger.exception("Error running tracking job: %s", e)

def start_scheduler():
    global _scheduler
    if _scheduler:
        return
    _scheduler = BackgroundScheduler()
    # Run every day at 08:00 server time (change as needed)
    _scheduler.add_job(_job_run_all_tracking, 'interval', hours=24, id="rank_tracker_daily", next_run_time=None)
    _scheduler.start()
