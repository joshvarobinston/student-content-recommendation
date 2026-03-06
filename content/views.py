# student_Reco/content/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

from .models import ContentItem
from .serializers import ContentItemSerializer
from .pagination import StandardResultsPagination
from .services.recommendation import generate_recommendations_for_user
from .services.tfidf import invalidate_tfidf_cache
from .services.external.youtube_fetch import fetch_youtube_videos
from .services.external.news_fetch import fetch_news_articles
from .services.external.google_books_fetch import fetch_google_books
from .services.external.ingestion import (
    ingest_external_videos,
    ingest_external_news,
    ingest_external_books,
)
from interests.models import UserInterest
from settings_app.models import UserSettings


class ContentListAPIView(APIView):
    """
    Read-only API to list all content items.
    """
    def get(self, request):
        contents = ContentItem.objects.all().order_by('-published_date')
        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InterestBasedRecommendationAPIView(APIView):
    """
    Simple interest-based filtering without ML.
    Filters content by user's interest domains and language.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get user language preference
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language

        interest_domain_ids = UserInterest.objects.filter(
            user=user
        ).values_list('interest', flat=True)

        queryset = ContentItem.objects.filter(
            interest_domain__in=interest_domain_ids,
            language=preferred_language  # ✅ Filter by language
        ).order_by('-published_date')

        serializer = ContentItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


def _fetch_and_ingest_for_user(user, language='en'):
    """
    Helper: Fetches fresh content from all APIs
    for ALL of the user's interest domains.
    """
    user_interests = UserInterest.objects.filter(
        user=user
    ).select_related('interest')

    for user_interest in user_interests:
        domain_name = user_interest.interest.name

        try:
            videos = fetch_youtube_videos(domain_name, max_results=3)
            ingest_external_videos(videos, domain_name, language=language)
        except Exception as e:
            print(f"YouTube fetch error for {domain_name}:", e)

        try:
            news = fetch_news_articles(domain_name, max_results=3)
            ingest_external_news(news, domain_name, language=language)
        except Exception as e:
            print(f"News fetch error for {domain_name}:", e)

        try:
            books = fetch_google_books(domain_name, max_results=2)
            ingest_external_books(books, domain_name, language=language)
        except Exception as e:
            print(f"Books fetch error for {domain_name}:", e)


class RecommendationAPIView(APIView):
    """
    Main ML-powered recommendation feed.

    Query params:
    - type   : video | news | article | book
    - sort   : relevant | newest | popular
    - date   : 24h | week | month
    - refresh: true → forces fresh content fetch from APIs
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ── Query Parameters ──────────────────────────
        content_type = request.query_params.get("type")
        sort_by = request.query_params.get("sort", "relevant")
        date_filter = request.query_params.get("date")
        refresh = request.query_params.get("refresh", "false").lower() == "true"

        # ── Get User Language Preference ──────────────
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language  # default 'en'

        # ── Refresh Content ───────────────────────────
        if refresh:
            invalidate_tfidf_cache()
            _fetch_and_ingest_for_user(user, language=preferred_language)
        else:
            _fetch_and_ingest_for_user(user, language=preferred_language)

        # ── ML Ranking ────────────────────────────────
        ranked_items = generate_recommendations_for_user(
            user,
            content_type=content_type
        )

        contents = [item["content"] for item in ranked_items]

        # ── Language Filter ───────────────────────────
        contents = [
            c for c in contents
            if c.language == preferred_language
        ]

        # ── Date Filter ───────────────────────────────
        if date_filter:
            now_time = timezone.now()
            cutoff_map = {
                "24h": now_time - timedelta(hours=24),
                "week": now_time - timedelta(days=7),
                "month": now_time - timedelta(days=30),
            }
            cutoff = cutoff_map.get(date_filter)
            if cutoff:
                contents = [
                    c for c in contents
                    if c.published_date and c.published_date >= cutoff
                ]

        # ── Sorting ───────────────────────────────────
        if sort_by == "newest":
            contents.sort(
                key=lambda x: x.published_date or timezone.now(),
                reverse=True
            )
        elif sort_by == "popular":
            contents.sort(
                key=lambda x: (
                    x.userview_set.count() +
                    x.userlike_set.count() * 3 +
                    x.usersave_set.count() * 5
                ),
                reverse=True
            )
        # "relevant" = already ML sorted

        # ── Pagination ────────────────────────────────
        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(contents, request)
        serializer = ContentItemSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    


class RefreshContentAPIView(APIView):
    """
    Dedicated refresh endpoint.
    Forces fresh content fetch from all APIs
    for the user's interests and clears TF-IDF cache.

    POST /api/content/refresh/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Get language preference
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language

        # Invalidate TF-IDF cache
        invalidate_tfidf_cache()

        # Fetch fresh content
        _fetch_and_ingest_for_user(user, language=preferred_language)

        return Response(
            {"message": "Content refreshed successfully"},
            status=status.HTTP_200_OK
        )