# student_Reco/accounts/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from interests.models import UserInterest


class ProfileSerializer(serializers.Serializer):
    email = serializers.EmailField()
    joined_at = serializers.DateTimeField()
    interests = serializers.ListField(child=serializers.CharField())

    @staticmethod
    def from_user(user: User) -> dict:
        interests = UserInterest.objects.filter(user=user).select_related("interest")
        interest_names = [ui.interest.name for ui in interests]

        return {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "joined_at": user.date_joined,
            "interests": interest_names,

        }

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

class UpdateProfileSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
