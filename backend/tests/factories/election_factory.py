from datetime import timedelta

import factory
from django.utils import timezone

from apps.elections.models import Candidate, Election, Position
from tests.factories.user_factory import UserFactory


class ElectionFactory(factory.django.DjangoModelFactory):
    """
    Factory for election instances.
    """

    class Meta:
        model = Election

    title = factory.Sequence(lambda n: f"Election {n}")

    description = "Test election"

    start_date = timezone.now()

    end_date = timezone.now() + timedelta(days=1)

    status = Election.Status.ONGOING

    created_by = factory.SubFactory(
        UserFactory,
        role="ADMIN",
    )


class PositionFactory(factory.django.DjangoModelFactory):
    """
    Factory for positions.
    """

    class Meta:
        model = Position

    election = factory.SubFactory(ElectionFactory)

    title = factory.Sequence(lambda n: f"Position {n}")

    max_votes = 1


class CandidateFactory(factory.django.DjangoModelFactory):
    """
    Factory for candidates.
    """

    class Meta:
        model = Candidate

    election = factory.SubFactory(ElectionFactory)

    position = factory.SubFactory(PositionFactory)

    user = factory.SubFactory(UserFactory)

    manifesto = "Test manifesto"
