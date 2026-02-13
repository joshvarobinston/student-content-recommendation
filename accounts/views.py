# student_Reco/accounts/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import ProfileSerializer

# For Profile API

class ProfileAPIView(APIView):
    """
    Returns profile details for the logged-in user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = ProfileSerializer.from_user(user)
        return Response(data, status=status.HTTP_200_OK)

# Additional API to update user interests from profile/settings page
from interests.models import InterestDomain, UserInterest


class UpdateUserInterestsAPIView(APIView):
    """
    Update interest domains for logged-in user
    Used in Profile / Settings page
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        interest_ids = request.data.get("interest_ids", [])

        if not interest_ids:
            return Response(
                {"error": "interest_ids is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

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
    

from engagement.models import UserSave
from content.serializers import ContentItemSerializer


class SavedItemsAPIView(APIView):
    """
    Returns all content items saved by the logged-in user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        saved_items = UserSave.objects.filter(user=user).select_related("content_item")

        contents = [item.content_item for item in saved_items]

        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
from engagement.models import UserLike


class LikedItemsAPIView(APIView):
    """
    Returns all content items liked by the logged-in user
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        liked_items = UserLike.objects.filter(user=user).select_related("content_item")

        contents = [item.content_item for item in liked_items]

        serializer = ContentItemSerializer(contents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


from django.contrib.auth.hashers import check_password
from .serializers import ChangePasswordSerializer


class ChangePasswordAPIView(APIView):
    """
    Allows logged-in user to change password securely
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data["old_password"]
            new_password = serializer.validated_data["new_password"]

            if not check_password(old_password, user.password):
                return Response(
                    {"error": "Old password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.save()

            return Response(
                {"message": "Password updated successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import DeleteAccountSerializer


class DeleteAccountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        serializer = DeleteAccountSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if serializer.validated_data["confirm"] is not True:
            return Response(
                {"error": "confirm=true is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        user.delete()

        return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)



from .serializers import UpdateProfileSerializer


class UpdateProfileAPIView(APIView):
    """
    Update first name and last name of logged-in user
    """

    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UpdateProfileSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user

            user.first_name = serializer.validated_data.get(
                "first_name", user.first_name
            )
            user.last_name = serializer.validated_data.get(
                "last_name", user.last_name
            )

            user.save()

            return Response(
                {
                    "message": "Profile updated successfully",
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

