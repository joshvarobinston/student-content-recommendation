# student_reco/settings_app/admin.py
from django.contrib import admin
from .models import UserSettings

@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ("user", "theme", "language", "items_per_page", "updated_at")
    list_filter = ("theme", "language", "preferred_content_type")
    search_fields = ("user__username",)