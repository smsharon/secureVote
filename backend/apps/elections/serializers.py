from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.elections.models import Candidate, CandidateApplication, Election, Position
from apps.elections.validators import validate_election_dates

User = get_user_model()

class ElectionSerializer(serializers.ModelSerializer):
    """
    Serializer for election objects.
    """

    created_by = serializers.StringRelatedField(
        read_only=True,
    )

    class Meta:
        model = Election

        fields = [
            "id",
            "title",
            "description",
            "start_date",
            "end_date",
            "status",
            "created_by",
            "created_at",
        ]

    def validate(self, attrs):
        """
        Validates election dates.
        """

        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        validate_election_dates(
            start_date,
            end_date,
        )

        return attrs


class PositionSerializer(serializers.ModelSerializer):
    """
    Serializer for election positions.
    """

    class Meta:
        model = Position

        fields = [
            "id",
            "election",
            "title",
            "description",
            "max_votes",
        ]


class CandidateSerializer(serializers.ModelSerializer):
    """
    Serializer for election candidates.
    """

    
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(
            role=User.Role.VOTER,
        ),
        write_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = Candidate

        fields = [
            "id",
            "election",
            "position",
            "user",
            "username",
            "manifesto",
            "image",
            "created_at",
        ]

    def validate(self, attrs):
        """
        Validates candidate election and position
        relationships.
        """

        election = attrs.get("election")
        position = attrs.get("position")
        user = attrs.get("user")

        if position.election_id != election.id:
            raise serializers.ValidationError(
                {
                    "position": (
                        "The selected position does not "
                        "belong to the selected election."
                    )
                }
            )

        if Candidate.objects.filter(
            position=position,
            user=user,
        ).exists():
            raise serializers.ValidationError(
                {
                    "user": (
                        "This user is already a candidate "
                        "for this position."
                    )
                }
            )

        return attrs

class CandidateApplicationSerializer(
    serializers.ModelSerializer
    ):
    """
    Serializer for voter candidacy applications.
    """


    applicant = serializers.StringRelatedField(
        read_only=True,
    )

    status = serializers.CharField(
        read_only=True,
    )

    rejection_reason = serializers.CharField(
        read_only=True,
    )

    reviewed_at = serializers.DateTimeField(
        read_only=True,
    )

    reviewed_by = serializers.StringRelatedField(
        read_only=True,
    )

    class Meta:
        model = CandidateApplication

        fields = [
            "id",
            "applicant",
            "election",
            "position",
            "manifesto",
            "image",
            "status",
            "rejection_reason",
            "submitted_at",
            "reviewed_at",
            "reviewed_by",
        ]

        read_only_fields = [
            "id",
            "applicant",
            "status",
            "rejection_reason",
            "submitted_at",
            "reviewed_at",
            "reviewed_by",
        ]

    def validate(self, attrs):
        """
        Validates that the selected position belongs
        to the selected election.
        """

        election = attrs.get("election")
        position = attrs.get("position")

        if position.election_id != election.id:
            raise serializers.ValidationError(
                {
                    "position": (
                        "The selected position does not "
                        "belong to the selected election."
                    )
                }
            )

        return attrs

class AdminCandidateApplicationSerializer(
    serializers.ModelSerializer
    ):
    """
    Serializer used by administrators to review
    candidate applications.
    """

    applicant = serializers.StringRelatedField(
        read_only=True,
    )

    election = serializers.StringRelatedField(
        read_only=True,
    )

    position = serializers.StringRelatedField(
        read_only=True,
    )

    reviewed_by = serializers.StringRelatedField(
        read_only=True,
    )

    class Meta:
        model = CandidateApplication

        fields = [
            "id",
            "applicant",
            "election",
            "position",
            "manifesto",
            "image",
            "status",
            "rejection_reason",
            "submitted_at",
            "reviewed_at",
            "reviewed_by",
        ]

        read_only_fields = fields
   
