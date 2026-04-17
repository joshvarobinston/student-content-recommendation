from datetime import timedelta

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from content.models import ContentItem
from interests.models import InterestDomain

from .models import LibraryFolder, LibraryItem


class LibraryAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="researcher@example.com",
            email="researcher@example.com",
            password="secure-pass-123",
        )
        self.client.force_authenticate(self.user)
        self.domain = InterestDomain.objects.create(name="Data Science")
        self.content = ContentItem.objects.create(
            title="Data Science Handbook",
            description="Notes and videos",
            content_type="book",
            interest_domain=self.domain,
            source_name="Books",
            source_url="https://example.com/book",
            published_date=timezone.now() - timedelta(days=2),
        )

    def test_add_item_to_folder_is_idempotent(self):
        folder = LibraryFolder.objects.create(user=self.user, name="Semester 8")

        first = self.client.post(
            f"/api/library/folders/{folder.id}/add-item/",
            {"content_item_id": self.content.id},
            format="json",
        )
        second = self.client.post(
            f"/api/library/folders/{folder.id}/add-item/",
            {"content_item_id": self.content.id},
            format="json",
        )

        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(LibraryItem.objects.filter(folder=folder, content_item=self.content).count(), 1)
