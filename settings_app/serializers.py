# student_reco/settings_app/serializers.py
from rest_framework import serializers
from .models import UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            "theme",
            "items_per_page",
            "show_thumbnails",
            "preferred_content_type",
            "language",
            "track_search_history",
            "track_view_history",
        ]
