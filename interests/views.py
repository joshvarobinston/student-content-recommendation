# student_Reco/interests/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import InterestDomain, UserInterest
from .serializers import (
    InterestDomainSerializer,
    UserInterestSerializer
)


class InterestDomainListAPIView(APIView):
    """
    Returns all available interest domains.
    Used during first-time user onboarding.
    """

    def get(self, request):
        interests = InterestDomain.objects.all()
        serializer = InterestDomainSerializer(interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SaveUserInterestAPIView(APIView):
    """
    Saves selected interest domains for the logged-in user.
    Protected API (authentication required).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserInterestSerializer(data=request.data)

        if serializer.is_valid():
            interest_ids = serializer.validated_data["interest_ids"]
            user = request.user

            # Remove old interests (for first-time or re-selection)
            UserInterest.objects.filter(user=user).delete()

            # Save new interests
            for interest_id in interest_ids:
                try:
                    interest = InterestDomain.objects.get(id=interest_id)
                    UserInterest.objects.create(
                        user=user,
                        interest=interest
                    )

                    
                except InterestDomain.DoesNotExist:
                    return Response(
                        {"error": f"Interest ID {interest_id} does not exist"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            return Response(
                {"message": "User interests saved successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status



class UpdateUserInterestsAPIView(APIView):
    """
    Replace user's selected interests.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserInterestSerializer(data=request.data)

        if serializer.is_valid():
            interest_ids = serializer.validated_data["interest_ids"]
            user = request.user

            # Remove old interests
            UserInterest.objects.filter(user=user).delete()

            # Add new interests
            for interest_id in interest_ids:
                try:
                    interest = InterestDomain.objects.get(id=interest_id)
                    UserInterest.objects.create(
                        user=user,
                        interest=interest
                    )
                except InterestDomain.DoesNotExist:
                    continue

            return Response(
                {"message": "Interests updated successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)