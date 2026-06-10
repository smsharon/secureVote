"""
Tests for rate limiting.
"""

import pytest
from django.core.cache import cache  # 1. Import the cache
from django.urls import reverse


@pytest.mark.django_db
def test_login_rate_limit(api_client):
    """
    Login endpoint should enforce rate limits.
    """
    cache.clear()  # 2. Clear any hits registered by previous tests

    url = reverse("token-obtain-pair")

    # Make exactly 5 requests (hitting the limit boundary)
    for _ in range(5):
        api_client.post(
            url,
            {
                "email": "fake@example.com",
                "password": "wrongpassword",
            },
        )

    # The 6th request should now cleanly trigger the rate limit blocks
    response = api_client.post(
        url,
        {
            "email": "fake@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 429
