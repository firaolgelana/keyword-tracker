from apscheduler.schedulers.background import BackgroundScheduler
from app.services.rank_tracker_service import RankTrackerService
from app.infrastructure.database_repository import Repository
import logging

logger = logging.getLogger(__name__)

_scheduler = None

def _job_run_all_tracking():
    # logger.info("Scheduler Tick: Job started")
    repo = Repository()
    service = RankTrackerService(repo, None)
    try:
        service.run_all_tracking_once()
    except Exception as e:
        logger.exception("Error running tracking job: %s", e)

def _job_cleanup_history():
    # logger.info("Scheduler Tick: Cleanup started")
    repo = Repository()
    service = RankTrackerService(repo, None)
    try:
        service.cleanup_history(days=7)
    except Exception as e:
        logger.exception("Error running cleanup job: %s", e)

def start_scheduler():
    global _scheduler
    if _scheduler:
        return
    _scheduler = BackgroundScheduler()
    # Run every minute to check for due tasks
    _scheduler.add_job(_job_run_all_tracking, 'interval', minutes=1, id="rank_tracker_tick")
    
    # Daily cleanup job (runs once every 24 hours)
    _scheduler.add_job(_job_cleanup_history, 'interval', days=1, id="rank_tracker_cleanup")
    
    _scheduler.start()
    logger.info("Rank Tracker Scheduler started")
