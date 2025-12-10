from dataclasses import dataclass
from typing import Optional, List, Dict

@dataclass
class RankResult:
    keyword: str
    domain: str
    position: Optional[int]  # None if not found
    serp_snippets: Optional[List[Dict]] = None  # optional parsed SERP items
