# student_Reco/engagement/admin.py

from django.contrib import admin
from .models import UserView, UserLike, UserSave, UserSearch


@admin.register(UserView)
class UserViewAdmin(admin.ModelAdmin):
    list_display = ("user", "content_item", "view_duration", "viewed_at")
    list_filter = ("viewed_at",)
    search_fields = ("user__username", "content_item__title")


@admin.register(UserLike)
class UserLikeAdmin(admin.ModelAdmin):
    list_display = ("user", "content_item", "liked_at")
    list_filter = ("liked_at",)
    search_fields = ("user__username", "content_item__title")


@admin.register(UserSave)
class UserSaveAdmin(admin.ModelAdmin):
    list_display = ("user", "content_item", "saved_at")
    list_filter = ("saved_at",)
    search_fields = ("user__username", "content_item__title")


@admin.register(UserSearch)
class UserSearchAdmin(admin.ModelAdmin):
    list_display = ("user", "query", "searched_at")
    list_filter = ("searched_at",)
    search_fields = ("user__username", "query")
