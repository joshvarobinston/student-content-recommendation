# student_Reco/content/urls.py

from django.urls import path
from .views import ContentListAPIView , InterestBasedRecommendationAPIView, RecommendationAPIView

urlpatterns = [
    path('list/', ContentListAPIView.as_view(), name='content-list'),
    path('recommendations/', InterestBasedRecommendationAPIView.as_view(), name='interest-based-recommendations'),
    path('personalized-recommendations/', RecommendationAPIView.as_view(), name='recommendations'),

]
