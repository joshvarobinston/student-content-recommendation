# student_Reco/content/serializers.py

from rest_framework import serializers
from .models import ContentItem
from .services.popularity import calculate_popularity_score
from .services.recency import calculate_recency_score


class ContentItemSerializer(serializers.ModelSerializer):
    interest_domain = serializers.StringRelatedField(read_only=True)
    popularity_score = serializers.SerializerMethodField()
    recency_score = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='userlike_set.count', read_only=True)
    saves_count = serializers.IntegerField(source='usersave_set.count', read_only=True)
    views_count = serializers.IntegerField(source='userview_set.count', read_only=True)

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
            'thumbnail_url',
            'published_date',
            'popularity_score',
            'recency_score',
            'likes_count',
            'saves_count',
            'views_count',
        ]

    def get_popularity_score(self, obj):
        return calculate_popularity_score(obj)

    def get_recency_score(self, obj):
        return calculate_recency_score(obj)