from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model for the Secure Vote System.

    Extends Django's AbstractUser to support
    role-based access control and future extensibility.
    """

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        VOTER = "VOTER", "Voter"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VOTER,
    )

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """
        Human-readable representation of the user.
        """
        return self.username