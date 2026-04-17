from datetime import timedelta

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class OTPVerification(models.Model):
    PURPOSE_SIGNIN = "signin"
    PURPOSE_PASSWORD_RESET = "password_reset"
    PURPOSE_CHOICES = (
        (PURPOSE_SIGNIN, "Sign In Verification"),
        (PURPOSE_PASSWORD_RESET, "Password Reset"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otp_codes")
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES)
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.purpose}"

    @staticmethod
    def default_expiry():
        return timezone.now() + timedelta(minutes=10)

    def is_expired(self):
        return timezone.now() >= self.expires_at
