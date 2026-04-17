# student_Reco/content/views_search.py

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from engagement.services import record_search_if_allowed
from settings_app.models import UserSettings

from content.pagination import StandardResultsPagination
from content.serializers import ContentItemSerializer
from content.services.domain_classifier import detect_interest_domain
from content.services.external.google_books_fetch import fetch_google_books
from content.services.external.ingestion import (
    ingest_external_books,
    ingest_external_news,
    ingest_external_videos,
)
from content.services.external.news_fetch import fetch_news_articles
from content.services.external.youtube_fetch import fetch_youtube_videos
from content.services.recommendation import generate_recommendations_for_user
from content.views import _apply_content_tags


class ExternalSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get("query", "").strip()
        if not query:
            return Response({"error": "Search query is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language

        record_search_if_allowed(user, query)
        domain_name = detect_interest_domain(query)

        try:
            videos = fetch_youtube_videos(query, max_results=10)
            saved_videos = ingest_external_videos(videos, domain_name, language=preferred_language)
            for item in saved_videos:
                _apply_content_tags(item, item.title, item.description, query, domain_name)
        except Exception as exc:
            print("YouTube search error:", exc)

        try:
            news_items = fetch_news_articles(query, max_results=10)
            saved_news = ingest_external_news(news_items, domain_name, language=preferred_language)
            for item in saved_news:
                _apply_content_tags(item, item.title, item.description, query, domain_name)
        except Exception as exc:
            print("News search error:", exc)

        try:
            books = fetch_google_books(query, max_results=3)
            saved_books = ingest_external_books(books, domain_name, language=preferred_language)
            for item in saved_books:
                _apply_content_tags(item, item.title, item.description, query, domain_name, item.author)
        except Exception as exc:
            print("Books search error:", exc)

        content_type = request.data.get("type")
        ranked_items = generate_recommendations_for_user(user, content_type=content_type)

        query_lower = query.lower()
        query_words = [word for word in query_lower.split() if len(word) > 3]

        def is_relevant(content):
            title = (content.title or "").lower()
            desc = (content.description or "").lower()
            if str(content.interest_domain) == "Others":
                return False

            tag_names = [content_tag.tag.name.lower() for content_tag in content.content_tags.select_related("tag").all()]
            return (
                query_lower in title
                or query_lower in desc
                or any(word in title for word in query_words)
                or any(word in tag_name for tag_name in tag_names for word in query_words)
            )

        contents = [
            item["content"]
            for item in ranked_items
            if is_relevant(item["content"]) and item["content"].language == preferred_language
        ]

        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(contents, request)
        serializer = ContentItemSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)
