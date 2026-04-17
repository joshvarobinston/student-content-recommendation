# student_Reco/authentication/urls.py

from django.urls import path
from .views import (
    ForgotPasswordAPIView,
    LoginAPIView,
    ResendOTPAPIView,
    ResetPasswordAPIView,
    SignupAPIView,
    VerifyOTPAPIView,
)

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('verify-otp/', VerifyOTPAPIView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPAPIView.as_view(), name='resend-otp'),
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
]
