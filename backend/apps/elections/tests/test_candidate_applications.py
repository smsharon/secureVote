import pytest

from rest_framework.test import APIClient

from apps.elections.models import (
    Candidate,
    CandidateApplication,
    Election,
    Position,
)
from apps.users.models import User


@pytest.fixture
def admin_user():
    return User.objects.create_user(
        username="api_admin",
        email="api_admin@example.com",
        password="TestPassword123!",
        role=User.Role.ADMIN,
    )


@pytest.fixture
def voter_user():
    return User.objects.create_user(
        username="api_voter",
        email="api_voter@example.com",
        password="TestPassword123!",
        role=User.Role.VOTER,
    )


@pytest.fixture
def election(admin_user):
    return Election.objects.create(
        title="API Test Election",
        description="Election for API tests",
        start_date="2026-09-01T10:00:00Z",
        end_date="2026-09-10T10:00:00Z",
        created_by=admin_user,
    )


@pytest.fixture
def position(election):
    return Position.objects.create(
        election=election,
        title="Treasurer",
        description="Test position",
        max_votes=1,
    )

@pytest.mark.django_db
def test_voter_can_submit_candidate_application(
voter_user,
election,
position,
):
    client = APIClient()


    client.force_authenticate(
        user=voter_user,
    )

    response = client.post(
        "/api/v1/elections/candidate-applications/",
        {
            "election": election.id,
            "position": position.id,
            "manifesto": "My election manifesto.",
        },
        format="json",
    )

    assert response.status_code == 201

    application = CandidateApplication.objects.get(
        applicant=voter_user,
    )

    assert application.status == (
        CandidateApplication.Status.PENDING
    )

    assert application.manifesto == (
        "My election manifesto."
    )


@pytest.mark.django_db
def test_admin_cannot_submit_candidate_application(
admin_user,
election,
position,
):
    client = APIClient()


    client.force_authenticate(
        user=admin_user,
    )

    response = client.post(
        "/api/v1/elections/candidate-applications/",
        {
            "election": election.id,
            "position": position.id,
            "manifesto": "Invalid admin application.",
        },
        format="json",
    )

    assert response.status_code == 403


@pytest.mark.django_db
def test_voter_can_only_see_own_applications(
voter_user,
election,
position,
):
    another_voter = User.objects.create_user(
        username="another_voter",
        email="[another_voter@example.com](mailto:another_voter@example.com)",
        password="TestPassword123!",
        role=User.Role.VOTER,
    )


    CandidateApplication.objects.create(
        applicant=another_voter,
        election=election,
        position=position,
        manifesto="Another voter's manifesto.",
    )

    CandidateApplication.objects.create(
        applicant=voter_user,
        election=election,
        position=position,
        manifesto="My manifesto.",
    )

    client = APIClient()

    client.force_authenticate(
        user=voter_user,
    )

    response = client.get(
        "/api/v1/elections/candidate-applications/my/",
    )

    assert response.status_code == 200

    data = response.data

    if isinstance(data, dict):
        data = data["results"]

    assert len(data) == 1
    assert data[0]["applicant"] == voter_user.username

@pytest.mark.django_db
def test_admin_can_view_candidate_applications(
admin_user,
voter_user,
election,
position,
):
    CandidateApplication.objects.create(
    applicant=voter_user,
    election=election,
    position=position,
    manifesto="My campaign manifesto.",
    )


    client = APIClient()

    client.force_authenticate(
        user=admin_user,
    )

    response = client.get(
        "/api/v1/elections/candidate-applications/admin/"
    )

    assert response.status_code == 200

    data = response.data

    if isinstance(data, dict):
        data = data["results"]

    assert len(data) == 1
    assert data[0]["applicant"] == voter_user.username
    assert data[0]["status"] == "PENDING"


@pytest.mark.django_db
def test_voter_cannot_view_admin_candidate_applications(
voter_user,
):
    client = APIClient()


    client.force_authenticate(
        user=voter_user,
    )

    response = client.get(
        "/api/v1/elections/candidate-applications/admin/"
    )

    assert response.status_code == 403


@pytest.mark.django_db
def test_admin_can_filter_pending_applications(
admin_user,
voter_user,
election,
position,
):
    CandidateApplication.objects.create(
    applicant=voter_user,
    election=election,
    position=position,
    manifesto="Pending manifesto.",
    )


    client = APIClient()

    client.force_authenticate(
        user=admin_user,
    )

    response = client.get(
        "/api/v1/elections/candidate-applications/admin/"
        "?status=PENDING"
    )

    assert response.status_code == 200

    data = response.data

    if isinstance(data, dict):
        data = data["results"]

    assert len(data) == 1
    assert data[0]["status"] == "PENDING"

@pytest.mark.django_db
def test_admin_can_approve_application(
admin_user,
voter_user,
election,
position,
):
    application = CandidateApplication.objects.create(
    applicant=voter_user,
    election=election,
    position=position,
    manifesto="My approved manifesto.",
    )

    client = APIClient()

    client.force_authenticate(
        user=admin_user,
    )

    response = client.post(
        f"/api/v1/elections/candidate-applications/"
        f"{application.id}/approve/",
    )

    assert response.status_code == 200

    application.refresh_from_db()

    assert application.status == (
        CandidateApplication.Status.APPROVED
    )

    assert application.reviewed_by == admin_user
    assert application.reviewed_at is not None

    candidate = Candidate.objects.get(
        user=voter_user,
        position=position,
    )

    assert candidate.election == election
    assert candidate.manifesto == (
        "My approved manifesto."
    )

@pytest.mark.django_db
def test_voter_cannot_approve_application(
voter_user,
election,
position,
):
    application = CandidateApplication.objects.create(
    applicant=voter_user,
    election=election,
    position=position,
    manifesto="My manifesto.",
    )

    client = APIClient()

    client.force_authenticate(
        user=voter_user,
    )

    response = client.post(
        f"/api/v1/elections/candidate-applications/"
        f"{application.id}/approve/",
    )

    assert response.status_code == 403

    application.refresh_from_db()

    assert application.status == (
        CandidateApplication.Status.PENDING
    )

    assert not Candidate.objects.filter(
        user=voter_user,
        position=position,
    ).exists()

@pytest.mark.django_db
def test_admin_can_reject_application(
admin_user,
voter_user,
election,
position,
):
    application = CandidateApplication.objects.create(
    applicant=voter_user,
    election=election,
    position=position,
    manifesto="My manifesto.",
    )

    client = APIClient()

    client.force_authenticate(
        user=admin_user,
    )

    response = client.post(
        f"/api/v1/elections/candidate-applications/"
        f"{application.id}/reject/",
        {
            "rejection_reason": (
                "Please provide more information."
            )
        },
        format="json",
    )

    assert response.status_code == 200

    application.refresh_from_db()

    assert application.status == (
        CandidateApplication.Status.REJECTED
    )

    assert application.rejection_reason == (
        "Please provide more information."
    )

    assert application.reviewed_by == admin_user
    assert application.reviewed_at is not None

    assert not Candidate.objects.filter(
        user=voter_user,
        position=position,
    ).exists()

@pytest.mark.django_db
def test_rejection_requires_reason(
admin_user,
voter_user,
election,
position,
):
    application = CandidateApplication.objects.create(
    applicant=voter_user,
    election=election,
    position=position,
    manifesto="My manifesto.",
    )

    client = APIClient()

    client.force_authenticate(
        user=admin_user,
    )

    response = client.post(
        f"/api/v1/elections/candidate-applications/"
        f"{application.id}/reject/",
        {
            "rejection_reason": "",
        },
        format="json",
    )

    assert response.status_code == 400

    application.refresh_from_db()

    assert application.status == (
        CandidateApplication.Status.PENDING
    )
