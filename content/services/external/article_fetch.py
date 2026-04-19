# student_Reco/content/services/external/article_fetch.py

from content.services.external.safe_request import safe_get

DEV_TO_ARTICLES_URL = "https://dev.to/api/articles"


def fetch_dev_to_articles(query, max_results=3):
    """
    Fetch articles from Dev.to API based on query/tag.
    Does not require an API key.
    """
    # Clean query into a tag format (e.g. "Machine Learning" -> "machinelearning" or just use the first word)
    tag = query.lower().replace(" ", "")
    
    params = {
        "tag": tag,
        "per_page": max_results
    }
    
    data, error = safe_get(DEV_TO_ARTICLES_URL, params=params, timeout=5)
    
    if error or not data:
        # Fallback to general search if tag fails
        params = {"per_page": max_results}
        data, error = safe_get(DEV_TO_ARTICLES_URL, params=params, timeout=5)
        if error or not data:
            print("Dev.to API error:", error)
            return []

    results = []
    for article in data:
        if not isinstance(article, dict):
            continue
            
        source_url = article.get("url")
        if not source_url:
            continue
            
        results.append({
            "title": article.get("title", ""),
            "description": article.get("description", ""),
            "source_name": "Dev.to",
            "source_url": source_url,
            "thumbnail_url": article.get("cover_image") or article.get("social_image") or "",
            "published_date": article.get("published_at", ""),
        })

    return results
