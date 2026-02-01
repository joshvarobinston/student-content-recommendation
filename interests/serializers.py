# student_Reco/interests/serializers.py

from rest_framework import serializers
from .models import InterestDomain
from django.contrib.auth.models import User


# Serializer for InterestDomain model
class InterestDomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestDomain
        fields = ['id', 'name']

# Serializer for saving user interests
class UserInterestSerializer(serializers.Serializer):
    """
    Saves selected interests for a user
    """
    interest_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )
