# student_Reco/content/models.py

from django.db import models
from interests.models import InterestDomain


class ContentItem(models.Model):
    """
    Core table that stores all recommendable content.
    Used by recommendation engine and ML vectorization (TF-IDF).
    """

    CONTENT_TYPES = (
        ('video', 'Video'),
        ('news', 'News'),
        ('article', 'Article'),
        ('book', 'Book / Research Paper'),
    )

    LANGUAGE_CHOICES = (
        ('en', 'English'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('de', 'German'),
        ('hi', 'Hindi'),
        ('ta', 'Tamil'),
    )

    # Core ML text fields
    title = models.CharField(max_length=255)
    description = models.TextField()

    # Content classification
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)

    # ✅ Language field
    language = models.CharField(
        max_length=10,
        choices=LANGUAGE_CHOICES,
        default='en'
    )

    # Interest-based filtering (critical for recommendations)
    interest_domain = models.ForeignKey(
        InterestDomain,
        on_delete=models.CASCADE,
        related_name='content_items'
    )

    # Source & metadata
    source_name = models.CharField(max_length=100)
    source_url = models.URLField(max_length=1000, unique=True)

    thumbnail_url = models.URLField(max_length=1000, blank=True)
    author = models.CharField(max_length=255, blank=True)

    # Recency & video-specific info
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
    Stores topic-level tags such as AI, ML, Health, Finance.
    Used for ML vector enrichment and filtering.
    """
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class ContentItemTag(models.Model):
    """
    Many-to-many mapping between ContentItem and ContentTag.
    """

    content_item = models.ForeignKey(
        ContentItem,
        on_delete=models.CASCADE,
        related_name='content_tags'
    )

    tag = models.ForeignKey(
        ContentTag,
        on_delete=models.CASCADE,
        related_name='tagged_contents'
    )

    class Meta:
        unique_together = ('content_item', 'tag')

    def __str__(self):
        return f"{self.content_item.title} → {self.tag.name}"