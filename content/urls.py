# student_Reco/content/urls.py

from django.urls import path
from .views import ContentListAPIView , InterestBasedRecommendationAPIView

urlpatterns = [
    path('list/', ContentListAPIView.as_view(), name='content-list'),
    path('recommendations/', InterestBasedRecommendationAPIView.as_view(), name='interest-based-recommendations'),


]
