from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.elections.models import Election, Candidate, CandidateApplication


class ElectionService:
    """
    Service layer for election business logic.
    """

    @staticmethod
    def create_election(validated_data, user):
        """
        Creates election instance.
        """

        return Election.objects.create(
            created_by=user,
            **validated_data,
        )



class CandidateApplicationService:
    """
    Handles candidate application approval and rejection.
    """

    @staticmethod
    @transaction.atomic
    def approve_application(
        application,
        admin_user,
    ):
        """
        Approves a pending application and creates
        the official Candidate record.
        """

        if application.status != CandidateApplication.Status.PENDING:
            raise ValidationError(
                "Only pending applications can be approved."
            )

        # Prevent duplicate candidate creation.
        candidate, created = Candidate.objects.get_or_create(
            position=application.position,
            user=application.applicant,
            defaults={
                "election": application.election,
                "manifesto": application.manifesto,
                "image": application.image,
            },
        )

        if not created:
            raise ValidationError(
                "A candidate already exists for this applicant "
                "and position."
            )

        application.status = (
            CandidateApplication.Status.APPROVED
        )

        application.reviewed_by = admin_user
        application.reviewed_at = timezone.now()
        application.rejection_reason = ""

        application.save(
            update_fields=[
                "status",
                "reviewed_by",
                "reviewed_at",
                "rejection_reason",
            ]
        )

        return candidate

    @staticmethod
    @transaction.atomic
    def reject_application(
        application,
        admin_user,
        rejection_reason,
    ):
        """
        Rejects a pending candidate application.
        """

        if application.status != CandidateApplication.Status.PENDING:
            raise ValidationError(
                "Only pending applications can be rejected."
            )

        if not rejection_reason.strip():
            raise ValidationError(
                "A rejection reason is required."
            )

        application.status = (
            CandidateApplication.Status.REJECTED
        )

        application.rejection_reason = rejection_reason.strip()
        application.reviewed_by = admin_user
        application.reviewed_at = timezone.now()

        application.save(
            update_fields=[
                "status",
                "rejection_reason",
                "reviewed_by",
                "reviewed_at",
            ]
        )

        return application
    
