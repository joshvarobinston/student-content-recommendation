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


class UserLikeToggleAPIView(APIView):
    """
    Toggle LIKE on a content item.
    
    If already liked → remove like.
    If not liked → create like.
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

            like_obj = UserLike.objects.filter(
                user=request.user,
                content_item=content
            ).first()

            # 🔁 Toggle logic
            if like_obj:
                like_obj.delete()
                return Response(
                    {"message": "Like removed"},
                    status=status.HTTP_200_OK
                )
            else:
                UserLike.objects.create(
                    user=request.user,
                    content_item=content
                )
                return Response(
                    {"message": "Content liked"},
                    status=status.HTTP_201_CREATED
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# student_Reco/engagement/views.py

from .models import UserSave


class UserSaveToggleAPIView(APIView):
    """
    Toggle Save (Bookmark):
    - If already saved → remove
    - If not saved → create
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        content_id = request.data.get("content_item_id")

        if not content_id:
            return Response(
                {"error": "content_item_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            content = ContentItem.objects.get(id=content_id)
        except ContentItem.DoesNotExist:
            return Response(
                {"error": "Content item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        save_obj = UserSave.objects.filter(
            user=request.user,
            content_item=content
        ).first()

        # 🔁 Toggle Logic
        if save_obj:
            save_obj.delete()
            return Response(
                {"message": "Removed from saved"},
                status=status.HTTP_200_OK
            )

        UserSave.objects.create(
            user=request.user,
            content_item=content
        )

        return Response(
            {"message": "Saved successfully"},
            status=status.HTTP_201_CREATED
        )



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
    
from .serializers import ContentItemSerializer

class UserSavedListAPIView(APIView):
    """
    Returns all content items saved by the user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        saves = UserSave.objects.filter(
            user=request.user
        ).select_related("content_item")

        contents = [save.content_item for save in saves]

        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserLikedListAPIView(APIView):
    """
    Returns all content items liked by the user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        likes = UserLike.objects.filter(
            user=request.user
        ).select_related("content_item")

        contents = [like.content_item for like in likes]

        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)