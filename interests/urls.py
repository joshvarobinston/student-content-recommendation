# student_Reco/interests/urls.py

from django.urls import path
from .views import (
    InterestDomainListAPIView,
    SaveUserInterestAPIView, 
    UpdateUserInterestsAPIView,
)

urlpatterns = [
    path('domains/', InterestDomainListAPIView.as_view(), name='interest-domains'),
    path('save/', SaveUserInterestAPIView.as_view(), name='save-user-interests'),
    path('update/', UpdateUserInterestsAPIView.as_view(), name='update-user-interests'),
]
