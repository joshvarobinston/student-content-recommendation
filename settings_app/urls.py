from django.urls import path
from .views import UserSettingsAPIView

urlpatterns = [
    path("user-settings/", UserSettingsAPIView.as_view(), name="user-settings"),
]
