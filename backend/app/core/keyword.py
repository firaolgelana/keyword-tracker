from dataclasses import dataclass
from typing import Optional, List

@dataclass
class KeywordSuggestion:
    keyword: str
    estimated_volume: Optional[int] = None
    difficulty: Optional[int] = None  # 0..100
    opportunity: Optional[str] = None  # "low"/"medium"/"high"
    related: Optional[List[str]] = None
