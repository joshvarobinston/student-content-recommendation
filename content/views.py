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


from content.services.recommendation import generate_recommendations_for_user

class RecommendationAPIView(APIView):
    """
    Returns personalized content recommendations for the logged-in user.

    Flow:
    1. Fetch fresh external content based on user interests
    2. Store new content (avoid duplicates)
    3. Run ML-based recommendation engine
    4. Return ranked content
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 🔹 STEP 1: Auto-refresh external content using user interests
        user_interests = UserInterest.objects.filter(user=user)

        for user_interest in user_interests:
            domain_name = user_interest.interest.name

            videos = fetch_youtube_videos(
                query=domain_name,
                max_results=3  # small number to avoid overload
            )

            ingest_external_videos(
                videos,
                interest_domain_name=domain_name
            )
            news_items = fetch_news_articles(
                query=domain_name,
                max_results=3
            )
            ingest_external_news(
                news_items,
                interest_domain_name=domain_name
            )
            books = fetch_google_books(
                query=domain_name,
                max_results=3
            )
            ingest_external_books(
                books,
                interest_domain_name=domain_name
            )

        # 🔹 STEP 2: Run ML recommendation engine
        ranked_items = generate_recommendations_for_user(user)

        # 🔹 STEP 3: Extract ContentItem objects
        contents = [item["content"] for item in ranked_items]

        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data)
    