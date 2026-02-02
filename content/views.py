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
    


from content.services.recommendation import generate_recommendations_for_user

class RecommendationAPIView(APIView):
    """
    Returns personalized content recommendations for the logged-in user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        ranked_items = generate_recommendations_for_user(user)

        # extract ContentItem objects only
        contents = [item["content"] for item in ranked_items]

        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data)

