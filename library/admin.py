# student_reco/library/admin.py

from django.contrib import admin
from .models import LibraryFolder, LibraryItem

@admin.register(LibraryFolder)
class LibraryFolderAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "created_at")
    search_fields = ("user__username", "name")

@admin.register(LibraryItem)
class LibraryItemAdmin(admin.ModelAdmin):
    list_display = ("folder", "content_item", "added_at")
    list_filter = ("folder",)