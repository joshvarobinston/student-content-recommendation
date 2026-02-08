# student_Reco/accounts/urls.py

from django.urls import path
from .views import ProfileAPIView, UpdateUserInterestsAPIView, SavedItemsAPIView, LikedItemsAPIView
from .views import ChangePasswordAPIView, DeleteAccountAPIView, UpdateProfileAPIView
urlpatterns = [
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path("update-interests/", UpdateUserInterestsAPIView.as_view(), name="update-interests"),
    path("saved-items/", SavedItemsAPIView.as_view(), name="saved-items"),
    path("liked-items/", LikedItemsAPIView.as_view(), name="liked-items"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change-password"),
    path("delete-account/", DeleteAccountAPIView.as_view(), name="delete-account"),
    path("update-profile/", UpdateProfileAPIView.as_view(), name="update-profile"),

]
