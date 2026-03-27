# student_Reco/accounts/urls.py

# accounts/urls.py
from django.urls import path
from .views import ProfileAPIView, SavedItemsAPIView, LikedItemsAPIView
from .views import ChangePasswordAPIView, DeleteAccountAPIView, UpdateProfileAPIView

urlpatterns = [
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path("saved-items/", SavedItemsAPIView.as_view(), name="saved-items"),
    path("liked-items/", LikedItemsAPIView.as_view(), name="liked-items"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change-password"),
    path("delete-account/", DeleteAccountAPIView.as_view(), name="delete-account"),
    path("update-profile/", UpdateProfileAPIView.as_view(), name="update-profile"),
    # ✅ update-interests REMOVED — use /api/interests/save/ instead
]




