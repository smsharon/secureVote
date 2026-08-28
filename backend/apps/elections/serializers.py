from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.elections.models import Candidate, Election, Position
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
        Ensures the position belongs to the selected election.
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






