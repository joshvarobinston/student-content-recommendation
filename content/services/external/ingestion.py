# student_Reco/content/services/external/ingestion.py

from django.utils.dateparse import parse_datetime
from django.utils.timezone import now, make_aware, is_naive
from content.models import ContentItem
from interests.models import InterestDomain

def make_datetime_aware(dt_str):
    if not dt_str:
        return now()
    dt = parse_datetime(dt_str)
    if not dt:
        return now()
    if is_naive(dt):
        return make_aware(dt)
    return dt

# for videos
def ingest_external_videos(videos, interest_domain_name):
    """
    Stores external (YouTube) videos into ContentItem table.
    Avoids duplicates using source_url.
    """

    interest_domain, _ = InterestDomain.objects.get_or_create(
        name=interest_domain_name
    )

    all_items = []

    for video in videos:
        item = ContentItem.objects.filter(source_url=video["source_url"]).first()
        if not item:
            item = ContentItem.objects.create(
                title=video["title"],
                description=video["description"],
                content_type="video",
                source_name=video["source_name"],
                source_url=video["source_url"],
                published_date=make_datetime_aware(video["published_date"]),
                interest_domain=interest_domain,
            )
        all_items.append(item)

    return all_items

# for news articles
def ingest_external_news(articles, interest_domain_name):
    """
    Stores external (NewsAPI) articles into ContentItem table.
    Avoids duplicates using source_url.
    """

    interest_domain, _ = InterestDomain.objects.get_or_create(
        name=interest_domain_name
    )

    all_items = []

    for article in articles:
        item = ContentItem.objects.filter(source_url=article["source_url"]).first()
        if not item:
            item = ContentItem.objects.create(
                title=article["title"],
                description=article["description"],
                content_type="article",
                source_name=article["source_name"],
                source_url=article["source_url"],
                published_date=make_datetime_aware(article["published_date"]),
                interest_domain=interest_domain,
            )
        all_items.append(item)

    return all_items
def ingest_external_books(books, interest_domain_name):
    """
    Stores external (Google Books) books into ContentItem table.
    Avoids duplicates using source_url.
    """

    

    interest_domain, _ = InterestDomain.objects.get_or_create(
        name=interest_domain_name
    )

    all_items = []

    for book in books:
        item = ContentItem.objects.filter(source_url=book["source_url"]).first()
        if not item:
            published_date = make_datetime_aware(book.get("published_date"))

            item = ContentItem.objects.create(
                title=book.get("title", ""),
                description=book.get("description", ""),
                content_type="book",
                source_name=book.get("source_name", "Google Books"),
                source_url=book.get("source_url", ""),
                published_date=published_date,
                interest_domain=interest_domain,
            )
        all_items.append(item)

    return all_items
