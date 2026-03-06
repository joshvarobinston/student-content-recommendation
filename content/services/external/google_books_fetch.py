# student_Reco/content/services/external/google_books_fetch.py

from django.conf import settings
from content.services.external.safe_request import safe_get

GOOGLE_BOOKS_SEARCH_URL = "https://www.googleapis.com/books/v1/volumes"


def fetch_google_books(query, max_results=3):
    """
    Fetch books from Google Books API.
    Returns raw book data (no ML, no DB).
    """
    params = {
        "q": query,
        "maxResults": max_results,
        "langRestrict": "en",
        "printType": "books",
        "key": settings.GOOGLE_BOOKS_API_KEY,
    }

    data, error = safe_get(GOOGLE_BOOKS_SEARCH_URL, params=params)

    if error or not data:
        print("Google Books API error:", error)
        return []

    results = []
    for item in data.get("items", []):
        volume = item.get("volumeInfo", {})

        source_url = volume.get("infoLink", "")
        if not source_url:
            continue

        # Get best thumbnail available
        thumbnails = volume.get("imageLinks", {})
        thumbnail = thumbnails.get("thumbnail") or thumbnails.get("smallThumbnail") or ""

        results.append({
            "title": volume.get("title", ""),
            "description": volume.get("description", ""),
            "source_name": "Google Books",
            "source_url": source_url,
            "thumbnail_url": thumbnail,
            "published_date": volume.get("publishedDate", ""),
        })

    return results