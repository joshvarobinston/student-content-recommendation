# student_Reco/content/services/external/youtube_fetch.py

import requests
from django.conf import settings


YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


def fetch_youtube_videos(query, max_results=3, region_code=None):
    """
    Fetch educational videos from YouTube based on a search query.
    """
    
    educational_query = f"{query} educational academic tutorial"

    params = {
        "part": "snippet",
        "q": educational_query,
        "type": "video",
        "videoCategoryId": "27",  # Education category
        "maxResults": max_results,
        "key": settings.YOUTUBE_API_KEY,
        "relevanceLanguage": "en",
        "language": "en",
    }

    if region_code:
        params["regionCode"] = region_code


    response = requests.get(YOUTUBE_SEARCH_URL, params=params)
    response.raise_for_status()

    data = response.json()

    results = []
    for item in data.get("items", []):
        snippet = item["snippet"]
        video_id = item["id"]["videoId"]

        results.append({
            "title": snippet["title"],
            "description": snippet["description"],
            "source_url": f"https://www.youtube.com/watch?v={video_id}",
            "published_date": snippet["publishedAt"],
            "source_name": "YouTube",
        })

    return results
