# student_Reco/content/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import ContentItem
from .serializers import ContentItemSerializer


class ContentListAPIView(APIView):
    """
    Read-only API to list all content items.
    Used by frontend & ML pipeline later.
    """

    def get(self, request):
        contents = ContentItem.objects.all().order_by('-published_date')
        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework.permissions import IsAuthenticated
from interests.models import UserInterest


class InterestBasedRecommendationAPIView(APIView):
    """
    Baseline recommendation endpoint.

    Filters content items based on the interest domains
    selected by the authenticated user.

    This endpoint performs candidate generation and serves
    as the foundation for later ML-based ranking.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        interest_domain_ids = UserInterest.objects.filter(
            user=user
        ).values_list('interest', flat=True)

        queryset = ContentItem.objects.filter(
            interest_domain__in=interest_domain_ids
        ).order_by('-published_date')

        serializer = ContentItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


from content.services.external.youtube_fetch import fetch_youtube_videos
from content.services.external.news_fetch import fetch_news_articles
from content.services.external.google_books_fetch import fetch_google_books
from content.services.external.ingestion import ingest_external_videos,ingest_external_news, ingest_external_books
from content.services.domain_classifier import detect_interest_domain
from interests.models import UserInterest
from content.serializers import ContentItemSerializer
from django.utils import timezone
from datetime import timedelta
from content.services.recommendation import generate_recommendations_for_user

class RecommendationAPIView(APIView):
    """
    Returns personalized content recommendations for the logged-in user.

    Flow:
    1. Fetch limited external content (safe)
    2. Store new content (avoid duplicates)
    3. Run ML-based recommendation engine
    4. Apply filters (type, date)
    5. Apply sorting
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # =============================
        # 🔹 FILTER PARAMETERS
        # =============================
        content_type = request.query_params.get("type")
        sort_by = request.query_params.get("sort", "relevant")
        date_filter = request.query_params.get("date")

        # =============================
        # 🔹 STEP 1: SAFE EXTERNAL FETCH
        # =============================
        user_interest = UserInterest.objects.filter(user=user).first()

        if user_interest:
            domain_name = user_interest.interest.name

            try:
                videos = fetch_youtube_videos(query=domain_name, max_results=3)
                ingest_external_videos(videos, domain_name)
            except Exception:
                pass

            try:
                news_items = fetch_news_articles(query=domain_name, max_results=3)
                ingest_external_news(news_items, domain_name)
            except Exception:
                pass

            try:
                books = fetch_google_books(query=domain_name, max_results=2)
                ingest_external_books(books, domain_name)
            except Exception:
                pass

        # =============================
        # 🔹 STEP 2: ML RANKING
        # =============================
        ranked_items = generate_recommendations_for_user(user)

        # Extract only ContentItem objects
        contents = [item["content"] for item in ranked_items]

        # =============================
        # 🔹 STEP 3: TYPE FILTER
        # =============================
        if content_type:
            contents = [
                c for c in contents
                if c.content_type == content_type
            ]

        # =============================
        # 🔹 STEP 4: DATE FILTER
        # =============================
        if date_filter:
            now_time = timezone.now()

            if date_filter == "24h":
                cutoff = now_time - timedelta(hours=24)
            elif date_filter == "week":
                cutoff = now_time - timedelta(days=7)
            elif date_filter == "month":
                cutoff = now_time - timedelta(days=30)
            else:
                cutoff = None

            if cutoff:
                contents = [
                    c for c in contents
                    if c.published_date and c.published_date >= cutoff
                ]

        # =============================
        # 🔹 STEP 5: SORTING
        # =============================

        if sort_by == "newest":
            contents.sort(
                key=lambda x: x.published_date or timezone.now(),
                reverse=True
            )

        elif sort_by == "popular":
            contents.sort(
                key=lambda x: x.engagement_events.count(),
                reverse=True
            )

        # "relevant" → already ML ranked
        # no need to sort

        # =============================
        # 🔹 STEP 6: RETURN RESPONSE
        # =============================
        serializer = ContentItemSerializer(contents, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    