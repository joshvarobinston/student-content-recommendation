# student_Reco/accounts/models.py

from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    ACCOUNT_TYPES = (
        ('student', 'Student'),
        ('educator', 'Educator'),
        ('researcher', 'Researcher'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    account_type = models.CharField(
        max_length=20,
        choices=ACCOUNT_TYPES,
        default='student'
    )
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    # Deprecated in favor of settings_app.UserSettings.language.
    language = models.CharField(max_length=10, default='en')
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email or self.user.username
