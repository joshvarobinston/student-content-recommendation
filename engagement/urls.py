# student_Reco/engagement/urls.py
from django.urls import path
from .views import UserLikeCreateAPIView, UserSaveCreateAPIView, UserViewCreateAPIView, UserSearchCreateAPIView
urlpatterns = [
    path('views/create/', UserViewCreateAPIView.as_view(), name='user-view-create'),
    path('likes/create/', UserLikeCreateAPIView.as_view(), name='user-like-create'),
    path('saves/create/', UserSaveCreateAPIView.as_view(), name='user-save-create'),
    path('searches/create/', UserSearchCreateAPIView.as_view(), name='user-search-create'),
]