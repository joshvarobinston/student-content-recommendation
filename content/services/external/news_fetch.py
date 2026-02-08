# Student_Reco/content/services/external/news_fetch.py

import requests
from django.conf import settings

NEWS_SEARCH_URL = "https://newsapi.org/v2/everything"


def fetch_news_articles(query, max_results=10):
    """
    Fetch news & articles from NewsAPI (English only)
    Returns raw content (no DB, no ML)
    """

    params = {
        "q": query,
        "language": "en",
        "sortBy": "relevancy",
        "pageSize": max_results,
        "apiKey": settings.NEWS_API_KEY,
        "language": "en",
        "relevanceLanguage": "en",
    }

    response = requests.get(NEWS_SEARCH_URL, params=params)
    response.raise_for_status()

    data = response.json()

    results = []
    for article in data.get("articles", []):
        results.append({
            "title": article["title"],
            "description": article["description"] or "",
            "source_name": article["source"]["name"],
            "source_url": article["url"],
            "published_date": article["publishedAt"],
        })

    return results
