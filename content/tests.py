from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from engagement.models import UserLike, UserSave, UserSearch, UserView
from interests.models import InterestDomain, UserInterest
from settings_app.models import UserSettings

from .models import ContentItem
from .services.user_profile import build_user_profile_text


class RecommendationSupportTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="learner@example.com",
            email="learner@example.com",
            password="secure-pass-123",
        )
        self.client.force_authenticate(self.user)
        self.domain = InterestDomain.objects.create(name="Artificial Intelligence")
        UserInterest.objects.create(user=self.user, interest=self.domain)
        UserSettings.objects.update_or_create(user=self.user, defaults={"items_per_page": 5})

    def _create_content(self, idx):
        return ContentItem.objects.create(
            title=f"AI Content {idx}",
            description="Artificial intelligence content",
            content_type="video",
            interest_domain=self.domain,
            source_name="YouTube",
            source_url=f"https://example.com/ai-{idx}",
            published_date=timezone.now() - timedelta(days=idx),
        )

    def test_user_profile_text_includes_search_save_like_and_view_signals(self):
        content = self._create_content(1)
        UserSearch.objects.create(user=self.user, query="transformers tutorial")
        UserSave.objects.create(user=self.user, content_item=content)
        UserLike.objects.create(user=self.user, content_item=content)
        UserView.objects.create(user=self.user, content_item=content, view_duration=180)

        profile_text = build_user_profile_text(self.user).lower()

        self.assertIn("artificial intelligence", profile_text)
        self.assertIn("transformers tutorial", profile_text)
        self.assertGreaterEqual(profile_text.count("ai content 1"), 6)

    @patch("content.views._fetch_and_ingest_for_user")
    @patch("content.views.generate_recommendations_for_user")
    def test_personalized_recommendations_use_items_per_page_setting(self, mock_generate, mock_fetch):
        contents = [self._create_content(i) for i in range(1, 7)]
        mock_fetch.return_value = None
        mock_generate.return_value = [{"content": content, "final_score": 1.0} for content in contents]

        response = self.client.get("/api/content/personalized-recommendations/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 6)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertEqual(response.data["current_page"], 1)
