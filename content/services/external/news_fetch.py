# student_Reco/content/services/external/news_fetch.py

import requests
from django.conf import settings

NEWS_SEARCH_URL = "https://newsapi.org/v2/everything"


def fetch_news_articles(query, max_results=10):
    """
    Fetch news articles from NewsAPI (English only).
    Returns raw content (no DB, no ML).
    """
    try:
        params = {
            "q": query,
            "language": "en",
            "sortBy": "relevancy",
            "pageSize": max_results,
            "apiKey": settings.NEWS_API_KEY,
        }

        response = requests.get(NEWS_SEARCH_URL, params=params, timeout=5)
        response.raise_for_status()

        data = response.json()
        results = []

        for article in data.get("articles", []):
            # Skip invalid articles
            if not article.get("url") or not article.get("title"):
                continue
            if article.get("title") == "[Removed]":
                continue

            results.append({
                "title": article.get("title", ""),
                "description": article.get("description") or "",
                "source_name": article["source"]["name"],
                "source_url": article["url"],
                "thumbnail_url": article.get("urlToImage") or "",
                "published_date": article.get("publishedAt", ""),
            })

        return results

    except requests.exceptions.RequestException as e:
        print("NewsAPI error:", e)
        return []