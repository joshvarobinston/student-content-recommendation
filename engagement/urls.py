# student_Reco/engagement/urls.py
from django.urls import path
from .views import (
    UserLikeToggleAPIView,
    UserSaveToggleAPIView,
    UserViewCreateAPIView,
    UserSearchCreateAPIView,
    UserSavedListAPIView,
    UserLikedListAPIView
    )
urlpatterns = [
    path('views/create/', UserViewCreateAPIView.as_view(), name='user-view-create'),
    path('like/toggle/', UserLikeToggleAPIView.as_view(), name='like-toggle'),
    path('saves/toggle/', UserSaveToggleAPIView.as_view(), name='user-save-toggle'),
    path('searches/create/', UserSearchCreateAPIView.as_view(), name='user-search-create'),
    path('saved/list/', UserSavedListAPIView.as_view(), name='user-saved-list'),
    path('liked/list/', UserLikedListAPIView.as_view(), name='user-liked-list'),
]