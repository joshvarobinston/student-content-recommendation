# student_Reco/content/services/external/ingestion.py

from django.utils.timezone import now
from django.utils.dateparse import parse_datetime
from content.models import ContentItem
from interests.models import InterestDomain
from content.services.tfidf import invalidate_tfidf_cache


def _get_or_create_domain(name):
    """Helper to get or create interest domain"""
    domain, _ = InterestDomain.objects.get_or_create(name=name)
    return domain


def ingest_external_videos(videos, interest_domain_name, language='en'):
    """
    Stores YouTube videos into ContentItem table.
    Avoids duplicates using source_url.
    """
    interest_domain = _get_or_create_domain(interest_domain_name)
    saved_items = []

    for video in videos:
        source_url = video.get("source_url", "")
        if not source_url:
            continue

        if ContentItem.objects.filter(source_url=source_url).exists():
            continue

        published = parse_datetime(video.get("published_date", ""))
        if not published:
            published = now()

        item = ContentItem.objects.create(
            title=video.get("title", ""),
            description=video.get("description", ""),
            content_type="video",
            source_name=video.get("source_name", "YouTube"),
            source_url=source_url,
            thumbnail_url=video.get("thumbnail_url", ""),
            published_date=published,
            interest_domain=interest_domain,
            language=language,  # ✅ Save language
        )
        saved_items.append(item)

    if saved_items:
        invalidate_tfidf_cache()

    return saved_items


def ingest_external_news(articles, interest_domain_name, language='en'):
    """
    Stores NewsAPI articles into ContentItem table.
    Avoids duplicates using source_url.
    """
    interest_domain = _get_or_create_domain(interest_domain_name)
    saved_items = []

    for article in articles:
        source_url = article.get("source_url", "")
        if not source_url:
            continue

        if ContentItem.objects.filter(source_url=source_url).exists():
            continue

        published = parse_datetime(article.get("published_date", ""))
        if not published:
            published = now()

        item = ContentItem.objects.create(
            title=article.get("title", ""),
            description=article.get("description", ""),
            content_type="news",
            source_name=article.get("source_name", ""),
            source_url=source_url,
            thumbnail_url=article.get("thumbnail_url", ""),
            published_date=published,
            interest_domain=interest_domain,
            language=language,  # ✅ Save language
        )
        saved_items.append(item)

    if saved_items:
        invalidate_tfidf_cache()

    return saved_items


def ingest_external_books(books, interest_domain_name, language='en'):
    """
    Stores Google Books into ContentItem table.
    Avoids duplicates using source_url.
    """
    interest_domain = _get_or_create_domain(interest_domain_name)
    saved_items = []

    for book in books:
        source_url = book.get("source_url", "")
        if not source_url:
            continue

        if ContentItem.objects.filter(source_url=source_url).exists():
            continue

        # ✅ Handle partial dates like "2023" or "2023-05"
        published = None
        date_str = book.get("published_date", "")
        if date_str:
            try:
                from dateutil import parser as date_parser
                published = date_parser.parse(date_str)
            except Exception:
                published = now()
        if not published:
            published = now()

        item = ContentItem.objects.create(
            title=book.get("title", ""),
            description=book.get("description", ""),
            content_type="book",
            source_name=book.get("source_name", "Google Books"),
            source_url=source_url,
            thumbnail_url=book.get("thumbnail_url", ""),
            published_date=published,
            interest_domain=interest_domain,
            language=language,  # ✅ Save language
        )
        saved_items.append(item)

    if saved_items:
        invalidate_tfidf_cache()

    return saved_items


def ingest_external_articles(articles, interest_domain_name, language='en'):
    """
    Stores Dev.to (or generic) articles into ContentItem table.
    Avoids duplicates using source_url.
    """
    interest_domain = _get_or_create_domain(interest_domain_name)
    saved_items = []

    for article in articles:
        source_url = article.get("source_url", "")
        if not source_url:
            continue

        if ContentItem.objects.filter(source_url=source_url).exists():
            continue

        published = parse_datetime(article.get("published_date", ""))
        if not published:
            published = now()

        item = ContentItem.objects.create(
            title=article.get("title", ""),
            description=article.get("description", ""),
            content_type="article",
            source_name=article.get("source_name", ""),
            source_url=source_url,
            thumbnail_url=article.get("thumbnail_url", ""),
            published_date=published,
            interest_domain=interest_domain,
            language=language,  # ✅ Save language
        )
        saved_items.append(item)

    if saved_items:
        invalidate_tfidf_cache()

    return saved_items