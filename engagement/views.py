# student_Reco/engagement/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import UserView
from .serializers import UserViewCreateSerializer
from content.models import ContentItem


class UserViewCreateAPIView(APIView):
    """
    Records a VIEW event when a user views content
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserViewCreateSerializer(data=request.data)

        if serializer.is_valid():
            content_id = serializer.validated_data["content_item_id"]
            duration = serializer.validated_data.get("view_duration", 0)

            try:
                content = ContentItem.objects.get(id=content_id)
            except ContentItem.DoesNotExist:
                return Response(
                    {"error": "Content item not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            UserView.objects.create(
                user=request.user,
                content_item=content,
                view_duration=duration
            )

            return Response(
                {"message": "View recorded"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import UserLike
from .serializers import UserLikeCreateSerializer


class UserLikeCreateAPIView(APIView):
    """
    Records a LIKE event when a user likes content
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserLikeCreateSerializer(data=request.data)

        if serializer.is_valid():
            content_id = serializer.validated_data["content_item_id"]

            try:
                content = ContentItem.objects.get(id=content_id)
            except ContentItem.DoesNotExist:
                return Response(
                    {"error": "Content item not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Prevent duplicate likes
            UserLike.objects.get_or_create(
                user=request.user,
                content_item=content
            )

            return Response(
                {"message": "Like recorded"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .models import UserSave
from .serializers import UserSaveCreateSerializer as UserSaveSerializer

class UserSaveCreateAPIView(APIView):
    """
    SAVE (bookmark) a content item
    Strongest positive signal
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSaveSerializer(data=request.data)

        if serializer.is_valid():
            content_item_id = serializer.validated_data["content_item_id"]
            user = request.user

            try:
                content_item = ContentItem.objects.get(id=content_item_id)
            except ContentItem.DoesNotExist:
                return Response(
                    {"error": "Content item not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            obj, created = UserSave.objects.get_or_create(
                user=user,
                content_item=content_item
            )

            if not created:
                return Response(
                    {"message": "Content already saved"},
                    status=status.HTTP_200_OK
                )

            return Response(
                {"message": "Content saved successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from .models import UserSearch
from .serializers import UserSearchCreateSerializer


class UserSearchCreateAPIView(APIView):
    """
    Records SEARCH queries entered by the user
    Used for personalization & ML profiling
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSearchCreateSerializer(data=request.data)

        if serializer.is_valid():
            UserSearch.objects.create(
                user=request.user,
                query=serializer.validated_data["query"]
            )

            return Response(
                {"message": "Search query recorded"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)