from django.conf import settings
from django.db import models
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
