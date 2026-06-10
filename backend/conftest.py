import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    """Test fixture returning an unauthenticated DRF APIClient."""
    return APIClient()
