# student_Reco/interests/views.py

from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import InterestDomain, UserInterest
from .serializers import InterestDomainSerializer, UserInterestSerializer


class InterestDomainListAPIView(APIView):
    def get(self, request):
        interests = InterestDomain.objects.all()
        serializer = InterestDomainSerializer(interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SaveUserInterestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserInterestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        interest_ids = serializer.validated_data["interest_ids"]
        user = request.user
        interests = list(InterestDomain.objects.filter(id__in=interest_ids))
        interest_map = {interest.id: interest for interest in interests}
        missing_ids = [interest_id for interest_id in interest_ids if interest_id not in interest_map]

        if missing_ids:
            return Response(
                {"error": f"Interest ID(s) do not exist: {missing_ids}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            UserInterest.objects.filter(user=user).delete()
            for interest_id in interest_ids:
                UserInterest.objects.create(user=user, interest=interest_map[interest_id])

        return Response({"message": "User interests saved successfully"}, status=status.HTTP_201_CREATED)
