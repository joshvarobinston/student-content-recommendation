# student_Reco/engagement/models.py

from django.db import models
from django.contrib.auth.models import User
from content.models import ContentItem


class UserView(models.Model):
    """
    Tracks when a user views a content item
    Used for popularity & behavioral analysis
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_item = models.ForeignKey(ContentItem, on_delete=models.CASCADE)
    view_duration = models.PositiveIntegerField(
        default=0,
        help_text="Time spent in seconds"
    )
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} viewed {self.content_item.title}"


class UserLike(models.Model):
    """
    Tracks liked (favorite) items
    Strong positive signal for ML
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_item = models.ForeignKey(ContentItem, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'content_item')

    def __str__(self):
        return f"{self.user.username} liked {self.content_item.title}"


class UserSave(models.Model):
    """
    Tracks saved items (read later)
    Stronger signal than likes
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_item = models.ForeignKey(ContentItem, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'content_item')

    def __str__(self):
        return f"{self.user.username} saved {self.content_item.title}"


class UserSearch(models.Model):
    """
    Tracks search queries entered by users
    Used for personalization & analytics
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    query = models.TextField()
    searched_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} searched '{self.query}'"


class UserActivity(models.Model):
    """
    Tracks user activities like login, signup, etc.
    Used for analytics and user engagement tracking
    """
    ACTIVITY_TYPES = (
        ('signup', 'User Signup'),
        ('login', 'User Login'),
        ('otp_verification', 'OTP Verification'),
        ('password_reset', 'Password Reset'),
        ('profile_update', 'Profile Update'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(
        max_length=20,
        choices=ACTIVITY_TYPES
    )
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'activity_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} at {self.created_at}"
    

    
