import os
import django
import sys

# Set up django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.test import Client

client = Client()

print("Testing signup...")
response = client.post("/api/auth/signup/", {
    "first_name": "Test",
    "last_name": "User",
    "email": "testscript13@example.com",
    "password": "StrongPassword123#@",
}, content_type="application/json", HTTP_HOST="localhost")

print("Signup Status:", response.status_code)
print("Signup Response:", response.content.decode())

print("\nTesting login...")
response = client.post("/api/auth/login/", {
    "email": "testscript13@example.com",
    "password": "StrongPassword123#@",
}, content_type="application/json", HTTP_HOST="localhost")

print("Login Status:", response.status_code)
print("Login Response:", response.content.decode())
