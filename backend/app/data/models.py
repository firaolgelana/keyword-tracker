from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.data.db import Base

class Keyword(Base):
    __tablename__ = "keywords"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, unique=True, index=True, nullable=False)
    estimated_volume = Column(Integer, nullable=True)  # optional estimate
    difficulty = Column(Integer, nullable=True)        # difficulty bucket 1-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TrackingKeyword(Base):
    __tablename__ = "tracking_keywords"
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, index=True, nullable=False)
    keyword = Column(String, index=True, nullable=False)
    frequency = Column(String, default="daily")  # daily/weekly
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    histories = relationship("RankHistory", back_populates="tracking", cascade="all, delete-orphan")

class RankHistory(Base):
    __tablename__ = "rank_history"
    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(Integer, ForeignKey("tracking_keywords.id"))
    position = Column(Integer, nullable=True)  # None if not found
    serp_snapshot = Column(Text, nullable=True)  # raw snippet or JSON
    checked_at = Column(DateTime(timezone=True), server_default=func.now())

    tracking = relationship("TrackingKeyword", back_populates="histories")

class RecentQuery(Base):
    __tablename__ = "recent_queries"
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, index=True)
    location = Column(String, default="Unknown")
    results_count = Column(String, default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
