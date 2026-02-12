# student_Reco/settings_app/models.py

from django.db import models
from django.contrib.auth.models import User


class UserSettings(models.Model):
    """
    Stores user preferences for UI and personalization.
    Does NOT allow user to change ML core weights.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # 🎨 UI Preferences
    theme = models.CharField(
        max_length=10,
        choices=(
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('auto', 'Auto'),
        ),
        default='light'
    )

    items_per_page = models.PositiveIntegerField(default=20)

    show_thumbnails = models.BooleanField(default=True)

    # 🌍 Content Preferences
    preferred_content_type = models.CharField(
        max_length=20,
        choices=(
            ('all', 'All'),
            ('video', 'Videos'),
            ('article', 'Articles'),
            ('book', 'Books'),
            ('news', 'News'),
        ),
        default='all'
    )

    language = models.CharField(
        max_length=20,
        default='en'
    )

    # 🔒 Privacy Controls
    track_search_history = models.BooleanField(default=True)
    track_view_history = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.username}"
