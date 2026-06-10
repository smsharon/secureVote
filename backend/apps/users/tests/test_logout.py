import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tests.factories.user_factory import UserFactory


@pytest.mark.django_db
def test_logout_blacklists_refresh_token():
    """
    Ensure logout blacklists refresh token.
    """

    user = UserFactory()

    refresh = RefreshToken.for_user(user)

    client = APIClient()

    client.force_authenticate(user=user)

    url = reverse("user-logout")

    response = client.post(
        url,
        {
            "refresh": str(refresh),
        },
        format="json",
    )

    assert response.status_code == 205
