# student_Reco/accounts/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers

from interests.models import UserInterest

from .models import UserProfile


class ProfileSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    joined_at = serializers.DateTimeField()
    account_type = serializers.CharField(allow_blank=True)
    bio = serializers.CharField(allow_blank=True)
    avatar_url = serializers.CharField(allow_blank=True)
    preferred_language = serializers.CharField(allow_blank=True)
    is_email_verified = serializers.BooleanField()
    interests = serializers.ListField(child=serializers.CharField())

    @staticmethod
    def from_user(user: User) -> dict:
        interests = UserInterest.objects.filter(user=user).select_related("interest")
        interest_names = [ui.interest.name for ui in interests]
        profile = UserProfile.objects.filter(user=user).first()
        user_settings = getattr(user, "usersettings", None)

        return {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "joined_at": user.date_joined,
            "account_type": profile.account_type if profile else "",
            "bio": profile.bio if profile else "",
            "avatar_url": profile.avatar_url if profile else "",
            "preferred_language": user_settings.language if user_settings else "",
            "is_email_verified": profile.is_email_verified if profile else False,
            "interests": interest_names,
        }


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)


class UpdateProfileSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)


class DeleteAccountSerializer(serializers.Serializer):
    confirm = serializers.BooleanField()
