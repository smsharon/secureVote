from django.conf import settings
from django.db import models

class Vote(models.Model):
    """
    Represents a secure vote cast by a voter
    for a candidate in a specific election position.
    """

    voter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="votes",
    )

    election = models.ForeignKey(
        "elections.Election",
        on_delete=models.CASCADE,
        related_name="votes",
    )

    position = models.ForeignKey(
        "elections.Position",
        on_delete=models.CASCADE,
        related_name="votes",
    )

    candidate = models.ForeignKey(
        "elections.Candidate",
        on_delete=models.CASCADE,
        related_name="votes",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "votes"

        ordering = ["-created_at"]

        indexes = [
            models.Index(
                fields=[
                    "election",
                    "position",
                ]
            ),

            models.Index(
                fields=[
                    "candidate",
                ]
            ),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "voter",
                    "election",
                    "position",
                ],
                name="unique_vote_per_position",
            )
        ]
    def __str__(self):
        """
        Human-readable vote representation.
        """

        return (
            f"{self.voter.username} voted for "
            f"{self.candidate.user.username}"
        )
