# student_Reco/authentication/urls.py

from django.urls import path
from .views import SignupAPIView, LoginAPIView, ForgotPasswordAPIView, ResetPasswordAPIView

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
]
