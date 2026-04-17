from django.core import mail
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import UserProfile
from settings_app.models import UserSettings
from .models import OTPVerification


class AuthenticationAPITests(APITestCase):
    def test_signup_creates_user_profile_and_settings(self):
        response = self.client.post(
            "/api/auth/signup/",
            {
                "first_name": "Ada",
                "last_name": "Lovelace",
                "email": "ada@example.com",
                "password": "strong-pass-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="ada@example.com")
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        self.assertTrue(UserSettings.objects.filter(user=user).exists())

    def test_login_returns_jwt_tokens(self):
        user = User.objects.create_user(
            username="grace@example.com",
            email="grace@example.com",
            password="secure-pass-123",
        )
        UserProfile.objects.create(user=user, is_email_verified=True)

        response = self.client.post(
            "/api/auth/login/",
            {
                "email": "grace@example.com",
                "password": "secure-pass-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_first_login_sends_signin_otp_and_verify_returns_tokens(self):
        user = User.objects.create_user(
            username="otp@example.com",
            email="otp@example.com",
            password="secure-pass-123",
        )
        UserProfile.objects.create(user=user, is_email_verified=False)

        response = self.client.post(
            "/api/auth/login/",
            {"email": user.email, "password": "secure-pass-123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertTrue(response.data["requires_otp"])
        otp = OTPVerification.objects.get(user=user, purpose=OTPVerification.PURPOSE_SIGNIN, is_used=False)
        self.assertEqual(len(mail.outbox), 1)

        verify_response = self.client.post(
            "/api/auth/verify-otp/",
            {"email": user.email, "otp": otp.code, "purpose": OTPVerification.PURPOSE_SIGNIN},
            format="json",
        )

        self.assertEqual(verify_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", verify_response.data)
        self.assertIn("refresh", verify_response.data)
        user.userprofile.refresh_from_db()
        self.assertTrue(user.userprofile.is_email_verified)

    def test_forgot_password_sends_otp(self):
        user = User.objects.create_user(
            username="reset@example.com",
            email="reset@example.com",
            password="secure-pass-123",
        )

        response = self.client.post(
            "/api/auth/forgot-password/",
            {"email": user.email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            OTPVerification.objects.filter(user=user, purpose=OTPVerification.PURPOSE_PASSWORD_RESET, is_used=False).count(),
            1,
        )
        self.assertEqual(len(mail.outbox), 1)

    def test_reset_password_validates_new_password_strength(self):
        user = User.objects.create_user(
            username="reset2@example.com",
            email="reset2@example.com",
            password="secure-pass-123",
        )
        otp = OTPVerification.objects.create(
            user=user,
            purpose=OTPVerification.PURPOSE_PASSWORD_RESET,
            code="123456",
            expires_at=OTPVerification.default_expiry(),
        )

        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "email": user.email,
                "otp": otp.code,
                "new_password": "123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("new_password", response.data)

    def test_reset_password_with_valid_otp_updates_password(self):
        user = User.objects.create_user(
            username="reset3@example.com",
            email="reset3@example.com",
            password="secure-pass-123",
        )
        otp = OTPVerification.objects.create(
            user=user,
            purpose=OTPVerification.PURPOSE_PASSWORD_RESET,
            code="654321",
            expires_at=OTPVerification.default_expiry(),
        )

        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "email": user.email,
                "otp": otp.code,
                "new_password": "new-secure-pass-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        otp.refresh_from_db()
        self.assertTrue(otp.is_used)
        user.refresh_from_db()
        self.assertTrue(user.check_password("new-secure-pass-123"))
