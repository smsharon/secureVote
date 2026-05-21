import pytest

from django.urls import reverse

from tests.base import (
    AuthenticatedAPITestCase,
)

from tests.factories.user_factory import (
    UserFactory,
)

from tests.factories.election_factory import (
    ElectionFactory,
    PositionFactory,
    CandidateFactory,
)

from tests.factories.vote_factory import (
    VoteFactory,
)


@pytest.mark.django_db
def test_duplicate_vote_prevention():
    """
    Ensures users cannot vote twice
    for same position.
    """

    base = AuthenticatedAPITestCase()

    voter = UserFactory()

    election = ElectionFactory()

    position = PositionFactory(
        election=election
    )

    candidate = CandidateFactory(
        election=election,
        position=position,
    )

    VoteFactory(
        voter=voter,
        election=election,
        position=position,
        candidate=candidate,
    )

    base.authenticate(voter)

    payload = {
        "election": election.id,
        "position": position.id,
        "candidate": candidate.id,
    }

    response = base.client.post(
        reverse("cast-vote"),
        payload,
    )

    assert response.status_code == 400