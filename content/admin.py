#student_Reco/content/admin.py

from django.contrib import admin
from .models import ContentItem, ContentTag, ContentItemTag


@admin.register(ContentItem)
class ContentItemAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'content_type',
        'interest_domain',
        'source_name',
        'published_date',
        'created_at',
    )
    list_filter = ('content_type', 'interest_domain')
    search_fields = ('title', 'description', 'source_name')


@admin.register(ContentTag)
class ContentTagAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(ContentItemTag)
class ContentItemTagAdmin(admin.ModelAdmin):
    list_display = ('content_item', 'tag')
    list_filter = ('tag',)
