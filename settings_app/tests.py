from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class UserSettingsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="settings@example.com",
            email="settings@example.com",
            password="secure-pass-123",
        )
        self.client.force_authenticate(self.user)

    def test_rejects_invalid_items_per_page(self):
        response = self.client.put(
            "/api/settings/user-settings/",
            {"items_per_page": 0},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("items_per_page", response.data)

    def test_rejects_unsupported_language(self):
        response = self.client.put(
            "/api/settings/user-settings/",
            {"language": "jp"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("language", response.data)
