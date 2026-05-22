from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model for the Secure Vote System.

    Extends Django's AbstractUser to support:
    - role-based access control
    - verification workflows
    - future scalability
    """

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        VOTER = "VOTER", "Voter"

    email = models.EmailField(
        unique=True,
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VOTER,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "users"

        ordering = ["-created_at"]

    def __str__(self):
        """
        Returns readable user representation.
        """
        return self.username

    @property
    def is_admin(self):
        """
        Returns whether user has admin role.
        """

        return self.role == self.Role.ADMIN

    @property
    def is_voter(self):
        """
        Returns whether user has voter role.
        """

        return self.role == self.Role.VOTER
