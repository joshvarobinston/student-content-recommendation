# student_Reco/authentication/serializers.py

from rest_framework import serializers

# Serializer for user signup

class SignupSerializer(serializers.Serializer):
    """
    Signup serializer skeleton.
    Validation and user creation will be added step-by-step.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# Serializer for user login

class LoginSerializer(serializers.Serializer):
    """
    Login serializer (email + password)
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
