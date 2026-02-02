# student_Reco/content/serializers.py

from rest_framework import serializers
from .models import ContentItem


class ContentItemSerializer(serializers.ModelSerializer):
    interest_domain = serializers.StringRelatedField()

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
        ]
