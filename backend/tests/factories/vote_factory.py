import factory

from apps.votes.models import Vote

from tests.factories.user_factory import (
    UserFactory,
)

from tests.factories.election_factory import (
    ElectionFactory,
    PositionFactory,
    CandidateFactory,
)


class VoteFactory(factory.django.DjangoModelFactory):
    """
    Factory for votes.
    """

    class Meta:
        model = Vote

    voter = factory.SubFactory(UserFactory)

    election = factory.SubFactory(ElectionFactory)

    position = factory.SubFactory(PositionFactory)

    candidate = factory.SubFactory(CandidateFactory)
