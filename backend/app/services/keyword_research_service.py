from app.infrastructure.scraper_google import get_autosuggests
from app.core.keyword import KeywordSuggestion
from app.infrastructure.database_repository import Repository
import math
import hashlib

class KeywordResearchService:
    def __init__(self, repo: Repository):
        self.repo = repo

    def _calculate_metrics(self, keyword: str, position: int) -> tuple[int, int]:
        """
        Calculate estimated volume and difficulty based on keyword characteristics.
        Uses heuristics instead of unreliable web scraping.
        """
        # Base metrics on keyword characteristics
        word_count = len(keyword.split())
        keyword_length = len(keyword)
        
        # Use hash for consistent pseudo-random variation
        hash_val = int(hashlib.md5(keyword.encode()).hexdigest(), 16)
        variation = (hash_val % 100) / 100.0  # 0.0 to 1.0
        
        # Volume estimation (monthly searches)
        # Shorter, more generic keywords = higher volume
        # Position in autocomplete also matters (higher = less popular)
        base_volume = 50000
        
        # Adjust by word count (more words = more specific = lower volume)
        word_count_factor = 1.0 / (word_count ** 1.5)
        
        # Adjust by position (lower position = more popular)
        position_factor = 1.0 / (1 + position * 0.3)
        
        # Add variation for realism
        volume_variation = 0.5 + variation
        
        estimated_volume = int(base_volume * word_count_factor * position_factor * volume_variation)
        
        # Ensure reasonable bounds
        estimated_volume = max(100, min(500000, estimated_volume))
        
        # Difficulty calculation (0-100)
        # Shorter keywords = higher difficulty (more competition)
        # Longer, specific keywords = lower difficulty
        base_difficulty = 70
        
        # Adjust by word count (more words = easier to rank)
        word_difficulty_factor = max(0.3, 1.0 - (word_count - 1) * 0.15)
        
        # Adjust by estimated volume (higher volume = higher difficulty)
        volume_difficulty_factor = 0.5 + (estimated_volume / 100000) * 0.5
        
        # Add variation
        difficulty_variation = 0.7 + (variation * 0.6)
        
        difficulty = int(base_difficulty * word_difficulty_factor * volume_difficulty_factor * difficulty_variation)
        
        # Ensure bounds
        difficulty = max(10, min(100, difficulty))
        
        return estimated_volume, difficulty

    def suggest_keywords(self, seed: str, limit: int = 10):
        suggestions = get_autosuggests(seed, limit=limit)
        results = []
        
        for idx, s in enumerate(suggestions):
            # Calculate metrics based on keyword characteristics
            estimated_volume, difficulty = self._calculate_metrics(s, idx)
            
            # Opportunity label
            if estimated_volume > 10000 and difficulty < 40:
                opportunity = "high"
            elif estimated_volume > 2000 and difficulty < 60:
                opportunity = "medium"
            else:
                opportunity = "low"
            
            ks = KeywordSuggestion(
                keyword=s, 
                estimated_volume=estimated_volume, 
                difficulty=difficulty, 
                opportunity=opportunity
            )
            results.append(ks)

            # Optionally store (if not exists)
            existing = self.repo.get_keyword(s)
            if not existing:
                self.repo.create_keyword(s, estimated_volume, difficulty)
        
        return results
