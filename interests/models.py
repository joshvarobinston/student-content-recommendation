from django.db import models
from django.contrib.auth.models import User


class InterestDomain(models.Model):
    """
    Master table for interest categories.
    Example: Computer Science, Medical, Business, etc.
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class UserInterest(models.Model):
    """
    Mapping table between User and InterestDomain.
    Used for personalization and ML user profile creation.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_interests'
    )

    interest = models.ForeignKey(
        InterestDomain,
        on_delete=models.CASCADE,
        related_name='interested_users'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'interest')

    def __str__(self):
        return f"{self.user.username} → {self.interest.name}"
