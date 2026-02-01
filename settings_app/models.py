# student_Reco/settings_app/models.py

from django.db import models
from django.contrib.auth.models import User


class UserSettings(models.Model):
    """
    Stores user preferences and ML ranking weights
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # UI preferences
    theme = models.CharField(
        max_length=10,
        choices=(('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')),
        default='light'
    )
    items_per_page = models.PositiveIntegerField(default=20)

    # Recommendation weights (ML control)
    relevance_weight = models.FloatField(default=0.4)
    popularity_weight = models.FloatField(default=0.3)
    recency_weight = models.FloatField(default=0.3)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.username}"
