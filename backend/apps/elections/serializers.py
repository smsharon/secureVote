from rest_framework import serializers

from apps.elections.models import (
    Election,
    Position,
    Candidate,
)

from apps.elections.validators import (
    validate_election_dates,
)


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

    user = serializers.StringRelatedField(
        read_only=True,
    )

    class Meta:
        model = Candidate

        fields = [
            "id",
            "election",
            "position",
            "user",
            "manifesto",
            "image",
            "created_at",
        ]
