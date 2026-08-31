from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.core.exceptions import ValidationError


class Election(models.Model):
    """
    Represents a voting election event.
    """

    class Status(models.TextChoices):
        UPCOMING = "UPCOMING", "Upcoming"
        ONGOING = "ONGOING", "Ongoing"
        COMPLETED = "COMPLETED", "Completed"

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField()

    start_date = models.DateTimeField()

    end_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UPCOMING,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_elections",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "elections"

        ordering = ["-created_at"]

    def __str__(self):
        """
        Human-readable election representation.
        """

        return self.title

    @property
    def is_active(self):
        """
        Returns whether election is currently ongoing.
        """

        now = timezone.now()

        return self.start_date <= now <= self.end_date


class Position(models.Model):
    """
    Represents a contestable position in an election.
    """

    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name="positions",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    max_votes = models.PositiveIntegerField(
        default=1,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "positions"

        ordering = ["title"]

        unique_together = (
            "election",
            "title",
        )

    def __str__(self):
        """
        Human-readable position representation.
        """

        return f"{self.title} - {self.election.title}"


class Candidate(models.Model):
    """
    Represents a candidate contesting for a position.
    """

    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name="candidates",
    )

    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name="candidates",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="candidate_profiles",
    )

    manifesto = models.TextField()

    image = models.ImageField(
        upload_to="candidates/",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "candidates"


        ordering = ["user__username"]

        constraints = [
            models.UniqueConstraint(
                fields=["position", "user"],
                name="unique_candidate_per_position",
            ),
        ]


    
    def clean(self):
        """
        Validates that the candidate's position belongs
        to the same election.
        """

        
        if (
            self.position_id
            and self.election_id
            and self.position.election_id != self.election_id
        ):
            raise ValidationError(
                {
                    "position": (
                        "The candidate's position must "
                        "belong to the selected election."
                    )
                }
            )
        

    def __str__(self):
        """
        Human-readable candidate representation.
        """

        return f"{self.user.username} " f"- {self.position.title}"

class CandidateApplication(models.Model):
    """
    Represents a user's application to become a candidate
    in a specific election position.
    """


    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="candidate_applications",
    )

    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name="candidate_applications",
    )

    position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name="candidate_applications",
    )

    manifesto = models.TextField()

    image = models.ImageField(
        upload_to="candidate_applications/",
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    rejection_reason = models.TextField(
        blank=True,
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True,
    )

    reviewed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="reviewed_candidate_applications",
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "candidate_applications"

        ordering = ["-submitted_at"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "applicant",
                    "election",
                    "position",
                ],
                condition=Q(
                    status__in=[
                        "PENDING",
                        "APPROVED",
                    ]
                ),
                name="unique_active_candidate_application",
            ),
        ]

    def clean(self):
        """
        Ensures the application references a valid voter
        and that the position belongs to the selected election.
        """

        if self.applicant_id:
            applicant = self.applicant

            if applicant.role != applicant.Role.VOTER:
                raise ValidationError(
                    {
                        "applicant": (
                            "Only voters can submit "
                            "candidate applications."
                        )
                    }
                )

        if (
            self.position_id
            and self.election_id
            and self.position.election_id != self.election_id
        ):
            raise ValidationError(
                {
                    "position": (
                        "The selected position does not "
                        "belong to the selected election."
                    )
                }
            )

    def __str__(self):
        return (
            f"{self.applicant.username} - "
            f"{self.position.title} - "
            f"{self.status}"
        )

