# student_Reco/content/views_search.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from content.services.external.youtube_fetch import fetch_youtube_videos
from content.services.external.news_fetch import fetch_news_articles
from content.services.external.google_books_fetch import fetch_google_books
from content.services.external.ingestion import (
    ingest_external_videos,
    ingest_external_news,
    ingest_external_books,
)
from content.services.recommendation import generate_recommendations_for_user
from content.services.domain_classifier import detect_interest_domain
from content.serializers import ContentItemSerializer
from content.pagination import StandardResultsPagination
from engagement.models import UserSearch
from settings_app.models import UserSettings
from interests.models import UserInterest


class ExternalSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get("query", "").strip()

        if not query:
            return Response(
                {"error": "Search query is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        # ── Get User Language + Interest Preferences ──
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language

        # Get user's interest domain names
        user_interest_domains = list(
            UserInterest.objects.filter(user=user)
            .values_list('interest__name', flat=True)
        )

        # ── 1. Save search query ──────────────────────
        UserSearch.objects.create(user=user, query=query)

        # ── 2. Detect domain ──────────────────────────
        domain_name = detect_interest_domain(query)

        # ── 3. Fetch fresh content ────────────────────
        try:
            videos = fetch_youtube_videos(query, max_results=10)
            ingest_external_videos(videos, domain_name, language=preferred_language)
        except Exception as e:
            print("YouTube search error:", e)

        try:
            news_items = fetch_news_articles(query, max_results=10)
            ingest_external_news(news_items, domain_name, language=preferred_language)
        except Exception as e:
            print("News search error:", e)

        try:
            books = fetch_google_books(query, max_results=3)
            ingest_external_books(books, domain_name, language=preferred_language)
        except Exception as e:
            print("Books search error:", e)

        # ── 4. Content type filter ────────────────────
        content_type = request.data.get("type")

        # ── 5. Run ML recommender ─────────────────────
        ranked_items = generate_recommendations_for_user(
            user,
            content_type=content_type
        )

        # ── 6. Filter by relevance + language + interests
        query_lower = query.lower()
        # Skip very short words like "a", "the", "of"
        query_words = [w for w in query_lower.split() if len(w) > 3]

        def is_relevant(content):
            title = (content.title or "").lower()
            desc = (content.description or "").lower()
            content_domain = str(content.interest_domain)

            # ✅ Must NOT be "Others" domain
            if content_domain == "Others":
                return False

            # ✅ Must match query in title or description
            query_match = (
                query_lower in title or
                query_lower in desc or
                any(word in title for word in query_words)
            )

            return query_match

        contents = [
            item["content"] for item in ranked_items
            if is_relevant(item["content"])
            and item["content"].language == preferred_language
        ]

        # ── 7. Paginate ───────────────────────────────
        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(contents, request)
        serializer = ContentItemSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)