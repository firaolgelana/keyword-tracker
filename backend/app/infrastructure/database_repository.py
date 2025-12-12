from app.data.db import SessionLocal
from app.data import models
from sqlalchemy.orm import Session
from typing import List, Optional

class Repository:
    def __init__(self):
        self._session: Session = SessionLocal()

    # --- Keywords ---
    def create_keyword(self, text: str, estimated_volume: Optional[int], difficulty: Optional[int]) -> models.Keyword:
        kw = models.Keyword(text=text, estimated_volume=estimated_volume, difficulty=difficulty)
        self._session.add(kw)
        self._session.commit()
        self._session.refresh(kw)
        return kw

    def get_keyword(self, text: str) -> Optional[models.Keyword]:
        return self._session.query(models.Keyword).filter_by(text=text).first()

    def list_keywords(self, limit:int=100) -> List[models.Keyword]:
        return self._session.query(models.Keyword).limit(limit).all()

    # --- Tracking ---
    def add_tracking_keyword(self, domain: str, keyword: str, frequency: str="daily") -> models.TrackingKeyword:
        tk = models.TrackingKeyword(domain=domain, keyword=keyword, frequency=frequency)
        self._session.add(tk)
        self._session.commit()
        self._session.refresh(tk)
        return tk

    def list_tracking(self) -> List[models.TrackingKeyword]:
        return self._session.query(models.TrackingKeyword).all()

    def get_tracking_by_id(self, tracking_id: int) -> Optional[models.TrackingKeyword]:
        return self._session.query(models.TrackingKeyword).filter_by(id=tracking_id).first()

    # --- Rank history ---
    def add_rank_history(self, tracking_id: int, position: Optional[int], serp_snapshot: Optional[str]) -> models.RankHistory:
        rh = models.RankHistory(tracking_id=tracking_id, position=position, serp_snapshot=serp_snapshot)
        self._session.add(rh)
        self._session.commit()
        self._session.refresh(rh)
        return rh

    def get_rank_history_for(self, tracking_id: int, limit: int=100):
        return self._session.query(models.RankHistory).filter_by(tracking_id=tracking_id).order_by(models.RankHistory.checked_at.desc()).limit(limit).all()

    def delete_tracking(self, tracking_id: int) -> bool:
        tk = self.get_tracking_by_id(tracking_id)
        if tk:
            self._session.delete(tk)
            self._session.commit()
            return True
        return False

    def update_tracking(self, tracking_id: int, domain: str, keyword: str, frequency: str) -> Optional[models.TrackingKeyword]:
        tk = self.get_tracking_by_id(tracking_id)
        if tk:
            tk.domain = domain
            tk.keyword = keyword
            tk.frequency = frequency
            self._session.commit()
            self._session.refresh(tk)
            return tk
        return None
