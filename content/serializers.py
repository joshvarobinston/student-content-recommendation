from rest_framework import serializers
from .models import ContentItem
from .services.popularity import calculate_popularity_score
from .services.recency import calculate_recency_score


class ContentItemSerializer(serializers.ModelSerializer):
    interest_domain = serializers.StringRelatedField()
    popularity_score = serializers.SerializerMethodField()
    recency_score = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = ContentItem
        fields = [
            'id',
            'title',
            'description',
            'content_type',
            'interest_domain',
            'source_name',
            'source_url',
            'published_date',
            'popularity_score',
            'recency_score',
            'is_liked',
            'is_saved'
        ]

    def get_popularity_score(self, obj):
        return calculate_popularity_score(obj)

    def get_recency_score(self, obj):
        return calculate_recency_score(obj)

    def get_is_liked(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            # Avoid circular import if possible, or use string reference if model is available
            from engagement.models import UserLike
            return UserLike.objects.filter(user=user, content_item=obj).exists()
        return False

    def get_is_saved(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            from engagement.models import UserSave
            return UserSave.objects.filter(user=user, content_item=obj).exists()
        return False