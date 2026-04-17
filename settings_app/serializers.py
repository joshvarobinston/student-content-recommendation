# student_reco/settings_app/serializers.py

from rest_framework import serializers

from .models import UserSettings


class UserSettingsSerializer(serializers.ModelSerializer):
    def validate_items_per_page(self, value):
        if value < 1 or value > 50:
            raise serializers.ValidationError("items_per_page must be between 1 and 50.")
        return value

    def validate_language(self, value):
        allowed_languages = {"en", "es", "fr", "de", "hi", "ta"}
        if value not in allowed_languages:
            raise serializers.ValidationError("Unsupported language.")
        return value

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
            "updated_at",
        ]
        read_only_fields = ["updated_at"]
