import pytest

from apps.votes.services import (
    ResultService,
)

from tests.factories.election_factory import (
    ElectionFactory,
    PositionFactory,
    CandidateFactory,
)

from tests.factories.vote_factory import (
    VoteFactory,
)

from tests.factories.user_factory import (
    UserFactory,
)


@pytest.mark.django_db
def test_result_aggregation():
    """
    Tests vote counting aggregation.
    """

    election = ElectionFactory()

    position = PositionFactory(
        election=election
    )

    candidate = CandidateFactory(
        election=election,
        position=position,
    )

    for _ in range(5):

        voter = UserFactory()

        VoteFactory(
            voter=voter,
            election=election,
            position=position,
            candidate=candidate,
        )

    results = (
        ResultService
        .get_election_results(
            election.id
        )
    )

    assert results[0]["total_votes"] == 5