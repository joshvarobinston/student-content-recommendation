from datetime import timedelta

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from content.models import ContentItem
from interests.models import InterestDomain
from settings_app.models import UserSettings

from .models import UserSearch, UserView


class EngagementPrivacyTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="student@example.com",
            email="student@example.com",
            password="secure-pass-123",
        )
        self.client.force_authenticate(self.user)
        self.domain = InterestDomain.objects.create(name="Machine Learning")
        self.content = ContentItem.objects.create(
            title="Intro to ML",
            description="Machine learning foundations",
            content_type="video",
            interest_domain=self.domain,
            source_name="YouTube",
            source_url="https://example.com/ml-video",
            published_date=timezone.now() - timedelta(days=1),
        )

    def test_view_not_recorded_when_tracking_disabled(self):
        UserSettings.objects.update_or_create(
            user=self.user,
            defaults={"track_view_history": False},
        )

        response = self.client.post(
            "/api/engagement/views/create/",
            {"content_item_id": self.content.id, "view_duration": 42},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(UserView.objects.filter(user=self.user, content_item=self.content).exists())

    def test_search_not_recorded_when_tracking_disabled(self):
        UserSettings.objects.update_or_create(
            user=self.user,
            defaults={"track_search_history": False},
        )

        response = self.client.post(
            "/api/engagement/searches/create/",
            {"query": "machine learning roadmap"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(UserSearch.objects.filter(user=self.user).exists())
