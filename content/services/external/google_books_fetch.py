# student_reco/content/services/external/google_books_fetch.py

import requests
from django.conf import settings

GOOGLE_BOOKS_SEARCH_URL = "https://www.googleapis.com/books/v1/volumes"


def fetch_google_books(query, max_results=3):
    """
    Fetch books from Google Books API based on a search query.
    - English books only
    - Uses API key
    - Returns raw data (no DB, no ML)
    """

    params = {
        "q": query,
        "maxResults": max_results,
        "langRestrict": "en",
        "printType": "books",
        
    }

    response = requests.get(GOOGLE_BOOKS_SEARCH_URL, params=params)
    response.raise_for_status()

    data = response.json()
    results = []

    for item in data.get("items", []):
        volume = item.get("volumeInfo", {})

        results.append({
            "title": volume.get("title", ""),
            "description": volume.get("description", ""),
            "authors": ", ".join(volume.get("authors", [])),
            "published_date": volume.get("publishedDate", ""),  # keep as string
            "source_name": "Google Books",
            "source_url": volume.get("infoLink", ""),
            "thumbnail_url": volume.get("imageLinks", {}).get("thumbnail"),
        })

    return results



