# student_Reco/content/services/external/news_fetch.py

from django.conf import settings

from content.services.external.safe_request import safe_get

NEWS_SEARCH_URL = "https://newsapi.org/v2/everything"


def fetch_news_articles(query, max_results=10):
    params = {
        "q": query,
        "language": "en",
        "sortBy": "relevancy",
        "pageSize": max_results,
        "apiKey": settings.NEWS_API_KEY,
    }

    data, error = safe_get(NEWS_SEARCH_URL, params=params, timeout=5)
    if error or not data:
        print("NewsAPI error:", error)
        return []

    results = []
    for article in data.get("articles", []):
        if not article.get("url") or not article.get("title"):
            continue
        if article.get("title") == "[Removed]":
            continue

        results.append(
            {
                "title": article.get("title", ""),
                "description": article.get("description") or "",
                "source_name": article["source"]["name"],
                "source_url": article["url"],
                "thumbnail_url": article.get("urlToImage") or "",
                "published_date": article.get("publishedAt", ""),
            }
        )

    return results
