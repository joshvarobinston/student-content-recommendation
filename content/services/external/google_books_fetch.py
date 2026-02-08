# student_reco/content/services/external/google_books_fetch.py

import requests
from django.conf import settings

GOOGLE_BOOKS_SEARCH_URL = "https://www.googleapis.com/books/v1/volumes"

import requests
from django.conf import settings

GOOGLE_BOOKS_SEARCH_URL = "https://www.googleapis.com/books/v1/volumes"

def fetch_google_books(query, max_results=3):
    try:
        params = {
            "q": query,
            "maxResults": max_results,
            "langRestrict": "en",
            "printType": "books",
            "key": settings.GOOGLE_BOOKS_API_KEY,
        }

        response = requests.get(GOOGLE_BOOKS_SEARCH_URL, params=params, timeout=5)
        response.raise_for_status()

        data = response.json()
        results = []

        for item in data.get("items", []):
            volume = item.get("volumeInfo", {})
            results.append({
                "title": volume.get("title", ""),
                "description": volume.get("description", ""),
                "source_name": "Google Books",
                "source_url": volume.get("infoLink", ""),
                "published_date": volume.get("publishedDate", ""),
            })

        return results

    except requests.exceptions.RequestException as e:
        # 🔥 NEVER crash the app
        print("Google Books API error:", e)
        return []


