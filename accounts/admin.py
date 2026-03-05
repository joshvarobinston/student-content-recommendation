# student_Reco/accounts/admin.
from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "account_type", "language", "created_at")
    list_filter = ("account_type",)
    search_fields = ("user__username", "user__email")