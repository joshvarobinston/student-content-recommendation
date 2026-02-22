# student_reco/library/models.py

from django.db import models
from django.contrib.auth.models import User
from content.models import ContentItem


class LibraryFolder(models.Model):
    """
    User-created study folder
    Example: "Final Year ML Project"
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="library_folders"
    )

    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self):
        return f"{self.user.username} - {self.name}"


class LibraryItem(models.Model):
    """
    Connects ContentItem to a user folder
    """

    folder = models.ForeignKey(
        LibraryFolder,
        on_delete=models.CASCADE,
        related_name="items"
    )

    content_item = models.ForeignKey(
        ContentItem,
        on_delete=models.CASCADE
    )

    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("folder", "content_item")

    def __str__(self):
        return f"{self.folder.name} → {self.content_item.title}"
