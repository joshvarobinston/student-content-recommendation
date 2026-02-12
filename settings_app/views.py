# student_reco/settings_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import UserSettings
from .serializers import UserSettingsSerializer


class UserSettingsAPIView(APIView):
    """
    GET  → Fetch user settings
    PUT  → Update user settings
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = UserSettings.objects.get_or_create(user=request.user)

        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings, _ = UserSettings.objects.get_or_create(user=request.user)

        serializer = UserSettingsSerializer(
            settings,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
