# student_Reco/content/models.py

from django.db import models


class ContentItem(models.Model):
    """
    Core table that stores all content types
    Used by recommendation engine and ML vectorization
    """

    CONTENT_TYPES = (
        ('video', 'Video'),
        ('news', 'News'),
        ('article', 'Article'),
        ('book', 'Book / Research Paper'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)

    source_name = models.CharField(max_length=100)
    source_url = models.URLField(unique=True)

    thumbnail_url = models.URLField(blank=True)
    author = models.CharField(max_length=255, blank=True)

    published_date = models.DateTimeField()
    duration = models.IntegerField(
        null=True,
        blank=True,
        help_text="Duration in seconds (only for videos)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.content_type})"


class ContentTag(models.Model):
    """
    Stores topic-level tags such as AI, ML, Health, Finance
    Helps ML and filtering
    """
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class ContentItemTag(models.Model):
    """
    Many-to-many mapping between ContentItem and ContentTag
    """

    content_item = models.ForeignKey(ContentItem, on_delete=models.CASCADE)
    tag = models.ForeignKey(ContentTag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('content_item', 'tag')

    def __str__(self):
        return f"{self.content_item.title} → {self.tag.name}"
