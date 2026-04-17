# student_Reco/engagement/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import UserView, UserLike, UserSave, UserSearch
from .serializers import (
    UserViewCreateSerializer,
    UserLikeCreateSerializer,
    UserSaveCreateSerializer,
    UserSearchCreateSerializer,
)
from content.models import ContentItem
from content.serializers import ContentItemSerializer
from .services import (
    get_liked_content_queryset,
    get_saved_content_queryset,
    record_search_if_allowed,
    record_view_if_allowed,
)



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

            record_view_if_allowed(request.user, content, duration)

            return Response(
                {"message": "View recorded"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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



class UserSaveToggleAPIView(APIView):
    """
    Toggle Save (Bookmark):
    - If already saved → remove
    - If not saved → create
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSaveCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        content_id = serializer.validated_data["content_item_id"]

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





class UserSearchCreateAPIView(APIView):
    """
    Records SEARCH queries entered by the user
    Used for personalization & ML profiling
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSearchCreateSerializer(data=request.data)

        if serializer.is_valid():
            record_search_if_allowed(request.user, serializer.validated_data["query"])

            return Response(
                {"message": "Search query recorded"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSavedListAPIView(APIView):
    """
    Returns all content items saved by the user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        contents = get_saved_content_queryset(request.user)
        serializer = ContentItemSerializer(contents, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserLikedListAPIView(APIView):
    """
    Returns all content items liked by the user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        contents = get_liked_content_queryset(request.user)
        serializer = ContentItemSerializer(contents, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
