from django.contrib.auth import get_user_model
from django.urls import reverse
import pytest
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
def test_user_registration():
    """
    Tests successful user registration.
    """

    client = APIClient()

    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "StrongPass123!",
        "password_confirm": "StrongPass123!",
    }

    response = client.post(
        reverse("user-register"),
        payload,
    )

    assert response.status_code == 201

    assert User.objects.filter(email="test@example.com").exists()


@pytest.mark.django_db
def test_user_login():
    """
    Tests JWT login functionality.
    """

    client = APIClient()

    user = User.objects.create_user(
        username="john",
        email="john@example.com",
        password="StrongPass123!",
    )

    payload = {
        "username": "john",
        "password": "StrongPass123!",
    }

    response = client.post(
        reverse("token-obtain-pair"),
        payload,
    )

    assert response.status_code == 200

    assert "access" in response.data
