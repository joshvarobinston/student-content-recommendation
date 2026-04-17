from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import InterestDomain, UserInterest


class InterestsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="interest@example.com",
            email="interest@example.com",
            password="secure-pass-123",
        )
        self.client.force_authenticate(self.user)
        self.existing_domain = InterestDomain.objects.create(name="AI")
        UserInterest.objects.create(user=self.user, interest=self.existing_domain)

    def test_save_interests_does_not_delete_existing_data_on_invalid_id(self):
        response = self.client.post(
            "/api/interests/save/",
            {"interest_ids": [999999]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(UserInterest.objects.filter(user=self.user, interest=self.existing_domain).exists())
