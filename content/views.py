# student_Reco/content/views.py


from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from interests.models import UserInterest
from settings_app.models import UserSettings

from .models import ContentItem, ContentItemTag, ContentTag
from .pagination import StandardResultsPagination
from .serializers import ContentItemSerializer
from .services.external.google_books_fetch import fetch_google_books
from .services.external.ingestion import (
    ingest_external_books,
    ingest_external_news,
    ingest_external_videos,
)
from .services.external.news_fetch import fetch_news_articles
from .services.external.youtube_fetch import fetch_youtube_videos
from .services.recommendation import generate_recommendations_for_user
from .services.tfidf import invalidate_tfidf_cache


def _apply_content_tags(content_item, *text_parts):
    tag_names = set()

    for part in text_parts:
        if not part:
            continue
        for raw_word in str(part).replace("/", " ").replace("-", " ").split():
            cleaned = raw_word.strip(".,:;!?()[]{}\"'").lower()
            if len(cleaned) >= 4:
                tag_names.add(cleaned)

    if getattr(content_item, "interest_domain", None):
        domain_name = content_item.interest_domain.name.lower()
        tag_names.update(word for word in domain_name.split() if len(word) >= 3)

    for tag_name in list(tag_names)[:10]:
        tag, _ = ContentTag.objects.get_or_create(name=tag_name)
        ContentItemTag.objects.get_or_create(content_item=content_item, tag=tag)


class ContentListAPIView(APIView):
    def get(self, request):
        contents = ContentItem.objects.select_related("interest_domain").order_by("-published_date")
        serializer = ContentItemSerializer(contents, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class InterestBasedRecommendationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language

        interest_domain_ids = UserInterest.objects.filter(user=user).values_list("interest", flat=True)
        queryset = (
            ContentItem.objects.filter(interest_domain__in=interest_domain_ids, language=preferred_language)
            .select_related("interest_domain")
            .order_by("-published_date")
        )

        serializer = ContentItemSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


def _fetch_and_ingest_for_user(user, language="en"):
    user_interests = UserInterest.objects.filter(user=user).select_related("interest")

    for user_interest in user_interests:
        domain_name = user_interest.interest.name

        try:
            videos = fetch_youtube_videos(domain_name, max_results=3)
            saved_videos = ingest_external_videos(videos, domain_name, language=language)
            for item in saved_videos:
                _apply_content_tags(item, item.title, item.description, domain_name, item.source_name)
        except Exception as exc:
            print(f"YouTube fetch error for {domain_name}:", exc)

        try:
            news = fetch_news_articles(domain_name, max_results=3)
            saved_news = ingest_external_news(news, domain_name, language=language)
            for item in saved_news:
                _apply_content_tags(item, item.title, item.description, domain_name, item.source_name)
        except Exception as exc:
            print(f"News fetch error for {domain_name}:", exc)

        try:
            books = fetch_google_books(domain_name, max_results=2)
            saved_books = ingest_external_books(books, domain_name, language=language)
            for item in saved_books:
                _apply_content_tags(item, item.title, item.description, domain_name, item.source_name, item.author)
        except Exception as exc:
            print(f"Books fetch error for {domain_name}:", exc)


class RecommendationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        content_type = request.query_params.get("content_type") or request.query_params.get("type")
        sort_by = request.query_params.get("sort", "relevant")
        date_filter = request.query_params.get("date")
        refresh = request.query_params.get("refresh", "false").lower() == "true"

        if content_type in {"", "all"}:
            content_type = None

        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language

        if refresh:
            invalidate_tfidf_cache()
        _fetch_and_ingest_for_user(user, language=preferred_language)

        ranked_items = generate_recommendations_for_user(user, content_type=content_type)
        contents = [item["content"] for item in ranked_items]

        if content_type:
            contents = [content for content in contents if content.content_type == content_type]

        contents = [content for content in contents if content.language == preferred_language]

        if date_filter:
            now_time = timezone.now()
            cutoff_map = {
                "24h": now_time - timedelta(hours=24),
                "week": now_time - timedelta(days=7),
                "month": now_time - timedelta(days=30),
            }
            cutoff = cutoff_map.get(date_filter)
            if cutoff:
                contents = [content for content in contents if content.published_date and content.published_date >= cutoff]

        if sort_by == "newest":
            contents.sort(key=lambda x: x.published_date or timezone.now(), reverse=True)
        elif sort_by == "popular":
            contents.sort(
                key=lambda x: (x.userview_set.count() + x.userlike_set.count() * 3 + x.usersave_set.count() * 5),
                reverse=True,
            )

        paginator = StandardResultsPagination()
        page = paginator.paginate_queryset(contents, request)
        serializer = ContentItemSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)


class RefreshContentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        preferred_language = user_settings.language

        invalidate_tfidf_cache()
        _fetch_and_ingest_for_user(user, language=preferred_language)

        return Response({"message": "Content refreshed successfully"}, status=status.HTTP_200_OK)
