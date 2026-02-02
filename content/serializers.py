from rest_framework import serializers
from .models import ContentItem
from .services.popularity import calculate_popularity_score
from .services.recency import calculate_recency_score


class ContentItemSerializer(serializers.ModelSerializer):
    interest_domain = serializers.StringRelatedField()
    popularity_score = serializers.SerializerMethodField()
    recency_score = serializers.SerializerMethodField()

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
            'recency_score'
        ]

    def get_popularity_score(self, obj):
        return calculate_popularity_score(obj)

    def get_recency_score(self, obj):
        return calculate_recency_score(obj)