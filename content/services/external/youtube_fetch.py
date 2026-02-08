# student_Reco/content/services/external/youtube_fetch.py

import requests
from django.conf import settings


YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


def fetch_youtube_videos(query, max_results=3):
    """
    Fetch videos from YouTube based on a search query.
    Returns raw video data (no ML, no DB).
    """

    params = {
    "part": "snippet",
    "q": query,
    "type": "video",
    "maxResults": max_results,
    "key": settings.YOUTUBE_API_KEY,
    # ✅ Language & region filters
    "relevanceLanguage": "en",
    "language": "en",
    
}


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
