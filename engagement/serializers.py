# student_Reco/engagement/serializers.py
from rest_framework import serializers
from content.models import ContentItem

# Serializers for recording user engagement events for views

class UserViewCreateSerializer(serializers.Serializer):
    content_item_id = serializers.IntegerField()
    view_duration = serializers.IntegerField(required=False, min_value=0)

# Serializers for recording user engagement events for likes

class UserLikeCreateSerializer(serializers.Serializer):
    content_item_id = serializers.IntegerField()

# Serializers for recording user engagement events for saves
class UserSaveCreateSerializer(serializers.Serializer):
    content_item_id = serializers.IntegerField()

# Serializers for recording user engagement events for searches
class UserSearchCreateSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=255,min_length=2)