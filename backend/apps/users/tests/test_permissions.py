from django.urls import reverse
import pytest

from tests.base import AuthenticatedAPITestCase
from tests.factories.user_factory import UserFactory


@pytest.mark.django_db
def test_voter_cannot_create_election():
    """
    Ensures voters cannot create elections.
    """

    base = AuthenticatedAPITestCase()

    voter = UserFactory(role="VOTER")

    base.authenticate(voter)

    payload = {
        "title": "Election",
        "description": "Test",
        "start_date": "2026-01-01T08:00:00Z",
        "end_date": "2026-01-02T18:00:00Z",
        "status": "ONGOING",
    }

    response = base.client.post(
        reverse("election-list-create"),
        payload,
    )

    assert response.status_code == 403
