# student_Reco/content/services/external/youtube_fetch.py

from django.conf import settings
from content.services.external.safe_request import safe_get

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
        "relevanceLanguage": "en",
    }

    data, error = safe_get(YOUTUBE_SEARCH_URL, params=params)

    if error or not data:
        print("YouTube API error:", error)
        return []

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        video_id = item.get("id", {}).get("videoId", "")

        if not video_id:
            continue

        results.append({
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "source_url": f"https://www.youtube.com/watch?v={video_id}",
            "thumbnail_url": snippet.get("thumbnails", {}).get("high", {}).get("url", ""),
            "published_date": snippet.get("publishedAt", ""),
            "source_name": "YouTube",
        })

    return results