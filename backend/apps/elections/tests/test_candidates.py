import pytest
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from apps.elections.models import Candidate, Election, Position
from apps.users.models import User

@pytest.mark.django_db
def test_candidate_position_must_belong_to_election():
    admin = User.objects.create_user(
        username="admin_test",
        email="[admin_test@example.com](mailto:admin_test@example.com)",
        password="TestPassword123!",
        role=User.Role.ADMIN,
    )

    voter = User.objects.create_user(
        username="voter_test",
        email="voter_test@example.com",
        password="TestPassword123!",
        role=User.Role.VOTER,
    )

    election_one = Election.objects.create(
        title="Election One",
        description="Test election one",
        start_date="2026-09-01T10:00:00Z",
        end_date="2026-09-02T10:00:00Z",
        created_by=admin,
    )

    election_two = Election.objects.create(
        title="Election Two",
        description="Test election two",
        start_date="2026-09-03T10:00:00Z",
        end_date="2026-09-04T10:00:00Z",
        created_by=admin,
    )

    position = Position.objects.create(
        election=election_two,
        title="President",
        description="Test position",
        max_votes=1,
    )

    candidate = Candidate(
        election=election_one,
        position=position,
        user=voter,
        manifesto="Test manifesto",
    )

    with pytest.raises(ValidationError):
        candidate.full_clean()


@pytest.mark.django_db
def test_candidate_duplicate_position_user_is_rejected():
    admin = User.objects.create_user(
        username="admin_duplicate",
        email="[admin_duplicate@example.com](mailto:admin_duplicate@example.com)",
        password="TestPassword123!",
        role=User.Role.ADMIN,
    )

    voter = User.objects.create_user(
        username="voter_duplicate",
        email="voter_duplicate@example.com",
        password="TestPassword123!",
        role=User.Role.VOTER,
    )

    election = Election.objects.create(
        title="Duplicate Test Election",
        description="Test election",
        start_date="2026-09-01T10:00:00Z",
        end_date="2026-09-02T10:00:00Z",
        created_by=admin,
    )

    position = Position.objects.create(
        election=election,
        title="President",
        description="Test position",
        max_votes=1,
    )

    Candidate.objects.create(
        election=election,
        position=position,
        user=voter,
        manifesto="First manifesto",
    )

    with pytest.raises(IntegrityError):
        Candidate.objects.create(
            election=election,
            position=position,
            user=voter,
            manifesto="Second manifesto",
        )

