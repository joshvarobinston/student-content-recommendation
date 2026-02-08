# student_Reco/content/services/external/ingestion.py

from django.utils.dateparse import parse_datetime
from content.models import ContentItem
from interests.models import InterestDomain

# for videos
def ingest_external_videos(videos, interest_domain_name):
    """
    Stores external (YouTube) videos into ContentItem table.
    Avoids duplicates using source_url.
    """

    interest_domain, _ = InterestDomain.objects.get_or_create(
        name=interest_domain_name
    )

    saved_items = []

    for video in videos:
        if ContentItem.objects.filter(source_url=video["source_url"]).exists():
            continue

        item = ContentItem.objects.create(
            title=video["title"],
            description=video["description"],
            content_type="video",
            source_name=video["source_name"],
            source_url=video["source_url"],
            published_date=parse_datetime(video["published_date"]),
            interest_domain=interest_domain,
        )

        saved_items.append(item)

    return saved_items

# for news articles
def ingest_external_news(articles, interest_domain_name):
    """
    Stores external (NewsAPI) articles into ContentItem table.
    Avoids duplicates using source_url.
    """

    interest_domain, _ = InterestDomain.objects.get_or_create(
        name=interest_domain_name
    )

    saved_items = []

    for article in articles:
        if ContentItem.objects.filter(source_url=article["source_url"]).exists():
            continue

        item = ContentItem.objects.create(
            title=article["title"],
            description=article["description"],
            content_type="article",
            source_name=article["source_name"],
            source_url=article["source_url"],
            published_date=parse_datetime(article["published_date"]),
            interest_domain=interest_domain,
        )

        saved_items.append(item)

    return saved_items
from django.utils.timezone import now
from django.utils.dateparse import parse_datetime
from content.models import ContentItem
from interests.models import InterestDomain
# for books

def ingest_external_books(books, interest_domain_name):
    """
    Stores external (Google Books) books into ContentItem table.
    Avoids duplicates using source_url.
    """

    

    interest_domain, _ = InterestDomain.objects.get_or_create(
        name=interest_domain_name
    )

    saved_items = []

    for book in books:
        if ContentItem.objects.filter(source_url=book["source_url"]).exists():
            continue

        published_date = parse_datetime(book.get("published_date", ""))
        if not published_date:
            published_date = now()

        item = ContentItem.objects.create(
            title=book.get("title", ""),
            description=book.get("description", ""),
            content_type="book",
            source_name=book.get("source_name", "Google Books"),
            source_url=book.get("source_url", ""),
            published_date=published_date,
            interest_domain=interest_domain,
        )

        saved_items.append(item)

    return saved_items
