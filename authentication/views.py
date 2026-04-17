# student_Reco/authentication/views.py

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import UserProfile
from django.conf import settings
from settings_app.models import UserSettings

from .models import OTPVerification
from .serializers import (
    ForgotPasswordSerializer,
    LoginSerializer,
    ResendOTPSerializer,
    ResetPasswordSerializer,
    SignupSerializer,
    VerifyOTPSerializer,
)


class SignupAPIView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        first_name = serializer.validated_data["first_name"]
        last_name = serializer.validated_data["last_name"]

        if User.objects.filter(username=email).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except Exception as exc:
            return Response({"password": list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            UserProfile.objects.create(user=user)
            UserSettings.objects.create(user=user)

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)


def _generate_otp_code():
    import random
    return f"{random.randint(0, 999999):06d}"


def _get_profile(user):
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return profile


def _issue_otp(user, purpose):
    OTPVerification.objects.filter(
        user=user,
        purpose=purpose,
        is_used=False,
        expires_at__gt=timezone.now(),
    ).update(is_used=True)

    otp = OTPVerification.objects.create(
        user=user,
        purpose=purpose,
        code=_generate_otp_code(),
        expires_at=OTPVerification.default_expiry(),
    )

    subject_map = {
        OTPVerification.PURPOSE_SIGNIN: "Student Reco sign-in OTP",
        OTPVerification.PURPOSE_PASSWORD_RESET: "Student Reco password reset OTP",
    }
    body_map = {
        OTPVerification.PURPOSE_SIGNIN: f"Your Student Reco sign-in OTP is {otp.code}. It expires in 10 minutes.",
        OTPVerification.PURPOSE_PASSWORD_RESET: f"Your Student Reco password reset OTP is {otp.code}. It expires in 10 minutes.",
    }

    send_mail(
        subject_map[purpose],
        body_map[purpose],
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

    return otp


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        user = authenticate(username=email, password=password)

        if user is None:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        profile = _get_profile(user)
        if not profile.is_email_verified:
            _issue_otp(user, OTPVerification.PURPOSE_SIGNIN)
            return Response(
                {
                    "message": "OTP sent to your email. Verify to complete sign in.",
                    "requires_otp": True,
                    "purpose": OTPVerification.PURPOSE_SIGNIN,
                },
                status=status.HTTP_202_ACCEPTED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )


class ForgotPasswordAPIView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            _issue_otp(user, OTPVerification.PURPOSE_PASSWORD_RESET)

        return Response(
            {"message": "If an account with this email exists, an OTP has been sent."},
            status=status.HTTP_200_OK,
        )


class VerifyOTPAPIView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]
        purpose = serializer.validated_data["purpose"]

        user = User.objects.filter(email=email).first()
        if user is None:
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

        otp_record = OTPVerification.objects.filter(
            user=user,
            purpose=purpose,
            code=otp,
            is_used=False,
        ).first()

        if otp_record is None or otp_record.is_expired():
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])

        if purpose == OTPVerification.PURPOSE_SIGNIN:
            profile = _get_profile(user)
            if not profile.is_email_verified:
                profile.is_email_verified = True
                profile.save(update_fields=["is_email_verified"])

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "OTP verified successfully",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)


class ResendOTPAPIView(APIView):
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        purpose = serializer.validated_data["purpose"]
        user = User.objects.filter(email=email).first()

        if user:
            _issue_otp(user, purpose)

        return Response({"message": "If the account exists, a new OTP has been sent."}, status=status.HTTP_200_OK)


class ResetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]
        new_password = serializer.validated_data["new_password"]

        user = User.objects.filter(email=email).first()
        if user is None:
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

        otp_record = OTPVerification.objects.filter(
            user=user,
            purpose=OTPVerification.PURPOSE_PASSWORD_RESET,
            code=otp,
            is_used=False,
        ).first()
        if otp_record is None or otp_record.is_expired():
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except Exception as exc:
            return Response({"new_password": list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)

        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
