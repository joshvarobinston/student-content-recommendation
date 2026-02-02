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
    

    
