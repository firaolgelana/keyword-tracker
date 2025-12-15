import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
from typing import List, Optional, Dict
import time
import random

HEADRES = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
}

def _sleep():
    time.sleep(0.8 + random.random() * 0.6)


def get_autosuggests(seed: str, limit: int = 10) -> List[str]:
    """
    Uses Google Suggest API endpoint to get suggestions.
    """
    url = f"https://suggestqueries.google.com/complete/search?client=chrome&q={quote_plus(seed)}"
    resp = requests.get(url, headers=HEADRES, timeout=10)
    if resp.status_code != 200:
        return []
    # response is like: ["seed", ["suggest1", "suggest2"], ...]
    try:
        data = resp.json()
        suggestions = data[1][:limit]
        return suggestions
    except Exception:
        return []


def get_search_results_count(keyword: str) -> Optional[int]:
    """
    Scrape the 'About X results' number from Google search results.
    Returns None if not available.
    """
    q = quote_plus(keyword)
    url = f"https://www.google.com/search?q={q}&hl=en"
    resp = requests.get(url, headers=HEADRES, timeout=10)
    if resp.status_code != 200:
        return None
    soup = BeautifulSoup(resp.text, "html.parser")
    stat = soup.find(id="result-stats")
    if not stat:
        # try other selector fallback
        stat = soup.select_one("div#result-stats, div.result-stats, div#res span")
    if not stat:
        return None
    text = stat.get_text()
    # Extract digits
    import re
    m = re.search(r"([\d,]+)", text)
    if not m:
        return None
    num = int(m.group(1).replace(",", ""))
    return num


def get_serp_positions(keyword: str, domain: str, max_pages: int = 1) -> Dict:
    """
    Very lightweight SERP parser: returns position (1..N) of first result matching domain.
    Also returns parsed snippet list for the first N results.
    max_pages controls how many pages (10 results each) to fetch (1 => first 10 results).
    """
    print(f"DEBUG: Scraper starting for '{keyword}' domain '{domain}'")
    result = {"position": None, "items": []}
    for page in range(max_pages):
        start = page * 10
        url = f"https://www.google.com/search?q={quote_plus(keyword)}&start={start}&hl=en"
        print(f"DEBUG: Fetching {url}")
        try:
            resp = requests.get(url, headers=HEADRES, timeout=5) # Reduced timeout
            print(f"DEBUG: Status {resp.status_code}")
            if resp.status_code != 200:
                print(f"DEBUG: Non-200 status: {resp.text[:100]}")
                continue
            soup = BeautifulSoup(resp.text, "html.parser")
            containers = soup.select("div.g")  # g class usually wraps results
            print(f"DEBUG: Found {len(containers)} containers")
            pos = start + 1
            for c in containers:
                a = c.find("a", href=True)
                h3 = c.find("h3")
                if not a or not h3:
                    continue
                href = a["href"]
                title = h3.get_text().strip()
                snippet = c.get_text().strip()
                result["items"].append({"position": pos, "title": title, "href": href, "snippet": snippet})
                if domain in href:
                    result["position"] = pos
                    print(f"DEBUG: Found match at {pos}")
                    return result
                pos += 1
            _sleep()
        except Exception as e:
            print(f"DEBUG: Requests exception: {e}")
    print(f"DEBUG: Scraper finished. Found: {result['position']}")
    return result

def get_serpapi_positions(keyword: str, domain: str, max_pages: int = 1) -> Dict:
    """
    Uses SerpApi to get real Google rank data.
    """
    try:
        from serpapi import GoogleSearch
    except ImportError:
        return {"position": None, "items": [], "error": "Dependency 'google-search-results' not installed."}

    import os
    
    api_key = os.getenv("SERP_API_KEY")
    if not api_key:
        return {"position": None, "items": [], "error": "Missing SERP_API_KEY. Sign up at serpapi.com to get one."}

    print(f"DEBUG: SerpApi Scraper for '{keyword}' domain '{domain}'")
    
    params = {
      "q": keyword,
      "location": "United States",
      "hl": "en",
      "gl": "us",
      "google_domain": "google.com",
      "api_key": api_key,
      "num": 100 # Fetch top 100 in one go if possible, or paginate
    }
    
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        
        # Check for error in response
        if "error" in results:
            error_msg = results["error"] # e.g. "Google Search: Quota limit reached"
            print(f"ERROR: SerpApi returned error: {error_msg}")
            return {"position": None, "items": [], "error": error_msg}

        organic_results = results.get("organic_results", [])
        
        found_position = None
        items = []
        
        # Parse results
        for item in organic_results:
            pos = item.get("position")
            title = item.get("title")
            link = item.get("link")
            snippet = item.get("snippet")
            
            # Simple structure for our frontend
            mapped_item = {
                "position": pos,
                "title": title,
                "href": link,
                "snippet": snippet
            }
            items.append(mapped_item)
            
            # Check for domain match
            if domain in link and found_position is None:
                found_position = pos
                print(f"DEBUG: SerpApi found match at {pos}")
        
        return {
            "position": found_position,
            "items": items[:15] # Keep it light for DB
        }
        
    except Exception as e:
        print(f"ERROR: SerpApi failed: {e}")
        return {"position": None, "items": [], "error": str(e)}
