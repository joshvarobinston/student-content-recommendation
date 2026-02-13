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

# student_Reco/content/serializers.py

from rest_framework import serializers
from .models import ContentItem


class ContentItemSerializer(serializers.ModelSerializer):
    """
    Main serializer for all content types:
    - Videos
    - News
    - Books
    - Articles

    Used in:
    - Recommendation API
    - Saved items list
    - Liked items list
    - Folder items
    """

    interest_domain = serializers.StringRelatedField(read_only=True)
    likes_count = serializers.IntegerField(source='userlike_set.count', read_only=True)
    saves_count = serializers.IntegerField(source='usersave_set.count', read_only=True)
    views_count = serializers.IntegerField(source='userview_set.count', read_only=True)

    class Meta:
        model = ContentItem
        fields = [
            "id",
            "title",
            "description",
            "content_type",
            "source_name",
            "source_url",
            "thumbnail_url",
            "published_date",
            "interest_domain",
            "created_at",
            "likes_count",
            "saves_count",
            "views_count"
        ]

    