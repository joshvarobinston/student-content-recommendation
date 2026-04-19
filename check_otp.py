import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from authentication.models import OTPVerification
from django.contrib.auth.models import User
from django.utils import timezone

email = "joshva.ug22.cs@mtec.ac.in"
user = User.objects.filter(email=email).first()
if user:
    print(f"User found: {user.username}")
    otps = OTPVerification.objects.filter(user=user).order_by('-created_at')
    for otp in otps:
        print(f"Code: {otp.code}, Purpose: {otp.purpose}, Is Used: {otp.is_used}, Expired: {otp.is_expired()}, Expires At: {otp.expires_at}")
else:
    print("User not found!")
