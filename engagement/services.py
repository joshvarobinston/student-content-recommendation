from django.db.models import QuerySet

from content.models import ContentItem
from settings_app.models import UserSettings

from .models import UserLike, UserSave, UserSearch, UserView


def get_user_settings(user):
    return UserSettings.objects.get_or_create(user=user)[0]


def should_track_search_history(user) -> bool:
    return get_user_settings(user).track_search_history


def should_track_view_history(user) -> bool:
    return get_user_settings(user).track_view_history


def record_search_if_allowed(user, query: str):
    if should_track_search_history(user):
        return UserSearch.objects.create(user=user, query=query)
    return None


def record_view_if_allowed(user, content_item, view_duration: int = 0):
    if should_track_view_history(user):
        return UserView.objects.create(
            user=user,
            content_item=content_item,
            view_duration=view_duration,
        )
    return None


def get_saved_content_queryset(user) -> QuerySet[ContentItem]:
    saved_content_ids = UserSave.objects.filter(user=user).values_list("content_item_id", flat=True)
    return ContentItem.objects.filter(id__in=saved_content_ids).select_related("interest_domain")


def get_liked_content_queryset(user) -> QuerySet[ContentItem]:
    liked_content_ids = UserLike.objects.filter(user=user).values_list("content_item_id", flat=True)
    return ContentItem.objects.filter(id__in=liked_content_ids).select_related("interest_domain")
