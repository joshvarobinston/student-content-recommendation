# student_Reco/content/views_search.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from content.services.external.youtube_fetch import fetch_youtube_videos
from content.services.external.ingestion import ingest_external_videos,ingest_external_news, ingest_external_books
from content.services.external.news_fetch import fetch_news_articles
from content.services.external.google_books_fetch import fetch_google_books
from content.services.recommendation import generate_recommendations_for_user
from content.services.domain_classifier import detect_interest_domain
from content.serializers import ContentItemSerializer
from engagement.models import UserSearch


class ExternalSearchAPIView(APIView):
    """
    Search API that fetches external content and ranks it using ML
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get("query")

        if not query:
            return Response(
                {"error": "Search query is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        # 1. Save search query (behavior signal)
        UserSearch.objects.create(user=user, query=query)

        # 2. Fetch from YouTube , NewsAPI, books
        videos = fetch_youtube_videos(query, max_results=3)
        news_items = fetch_news_articles(query, max_results=3)
        books = fetch_google_books(query, max_results=3)


        # 3. Ingest into DB (normalized)
        domain_name = detect_interest_domain(query)
        ingest_external_news(
            news_items,
            interest_domain_name=domain_name
        )
        ingest_external_videos(
            videos,
            interest_domain_name=domain_name
        )
        ingest_external_books(
            books,
            interest_domain_name=domain_name
        )

        # 4. Run ML recommender
        ranked_items = generate_recommendations_for_user(user)

        # 5. Serialize & return
        contents = [item["content"] for item in ranked_items]

        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
