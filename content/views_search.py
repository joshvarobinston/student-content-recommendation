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

        # 2. Fetch from YouTube (Regional), NewsAPI, books
        videos = []
        seen_video_urls = set()
        for region in ["US", "GB", "CA"]:
            regional_videos = fetch_youtube_videos(query, max_results=1, region_code=region)
            for v in regional_videos:
                if v["source_url"] not in seen_video_urls:
                    videos.append(v)
                    seen_video_urls.add(v["source_url"])
        
        videos = videos[:3]  # Strict limit

        news_items = fetch_news_articles(query, max_results=2)
        books = fetch_google_books(query, max_results=2)


        # 3. Ingest into DB (normalized)
        domain_name = detect_interest_domain(query)
        news_objs = ingest_external_news(
            news_items,
            interest_domain_name=domain_name
        )
        video_objs = ingest_external_videos(
            videos,
            interest_domain_name=domain_name
        )
        book_objs = ingest_external_books(
            books,
            interest_domain_name=domain_name
        )

        # 4. Combine results (Dedicated Search Context)
        raw_contents = news_objs + video_objs + book_objs
        
        # Final deduplication by ID just in case
        contents = []
        seen_ids = set()
        for c in raw_contents:
            if c.id not in seen_ids:
                contents.append(c)
                seen_ids.add(c.id)

        serializer = ContentItemSerializer(contents, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
