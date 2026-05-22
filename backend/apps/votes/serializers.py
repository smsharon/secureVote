from rest_framework import serializers

from apps.votes.models import Vote
from apps.votes.services import VoteService

from apps.elections.models import (
    Election,
    Position,
    Candidate,
)


class VoteSerializer(serializers.ModelSerializer):
    """
    Serializer responsible for validating
    secure vote submissions.
    """

    class Meta:
        model = Vote

        fields = [
            "id",
            "election",
            "position",
            "candidate",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

    def validate(self, attrs):
        """
        Performs comprehensive vote validation.
        """

        request = self.context["request"]

        voter = request.user

        election = attrs.get("election")
        position = attrs.get("position")
        candidate = attrs.get("candidate")

        # =================================================
        # VALIDATE ELECTION STATUS
        # =================================================

        if not election.is_active:
            raise serializers.ValidationError(
                {"election": "This election is not active."}
            )

        # =================================================
        # VALIDATE POSITION BELONGS TO ELECTION
        # =================================================

        if position.election_id != election.id:
            raise serializers.ValidationError(
                {"position": "Position does not belong to this election."}
            )

        # =================================================
        # VALIDATE CANDIDATE BELONGS TO POSITION
        # =================================================

        if candidate.position_id != position.id:
            raise serializers.ValidationError(
                {"candidate": "Candidate does not belong to this position."}
            )

        # =================================================
        # VALIDATE CANDIDATE BELONGS TO ELECTION
        # =================================================

        if candidate.election_id != election.id:
            raise serializers.ValidationError(
                {"candidate": "Candidate does not belong to this election."}
            )

        # =================================================
        # PREVENT DUPLICATE VOTING
        # =================================================

        already_voted = Vote.objects.filter(
            voter=voter,
            election=election,
            position=position,
        ).exists()

        if already_voted:
            raise serializers.ValidationError(
                {"vote": "You have already voted for this position."}
            )

        return attrs

    def create(self, validated_data):
        """
        Creates vote through service layer.
        """

        request = self.context["request"]

        return VoteService.cast_vote(
            validated_data=validated_data,
            voter=request.user,
        )


class CandidateResultSerializer(serializers.Serializer):
    """
    Serializer for aggregated candidate results.
    """

    candidate_id = serializers.IntegerField()

    candidate_name = serializers.CharField()

    position = serializers.CharField()

    total_votes = serializers.IntegerField()
