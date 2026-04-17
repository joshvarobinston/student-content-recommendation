# student_Reco/authentication/serializers.py

from rest_framework import serializers

# Serializer for user signup

class SignupSerializer(serializers.Serializer):
    """
    Signup serializer skeleton.
    Validation and user creation will be added step-by-step.
    """
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# Serializer for user login

class LoginSerializer(serializers.Serializer):
    """
    Login serializer (email + password)
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)
    new_password = serializers.CharField(write_only=True)


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)
    purpose = serializers.ChoiceField(choices=["signin", "password_reset"])


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=["signin", "password_reset"])
