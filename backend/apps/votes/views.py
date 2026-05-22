from django.shortcuts import render

# Create your views here.
from rest_framework import generics

from apps.votes.models import Vote

from apps.votes.serializers import (
    VoteSerializer,
)

from apps.users.permissions import (
    IsVoterRole,
    IsVerifiedUser,
)

from rest_framework.views import APIView
from rest_framework.response import Response

from apps.votes.services import (
    ResultService,
)

from drf_spectacular.utils import (
    extend_schema,
)

from apps.common.responses import (
    success_response,
)


@extend_schema(
    summary="Cast secure vote",
    description=("Allows verified voters to cast " "a vote securely."),
)
class VoteCreateView(generics.CreateAPIView):
    """
    Secure endpoint for casting votes.
    """

    serializer_class = VoteSerializer

    permission_classes = [
        IsVoterRole,
        IsVerifiedUser,
    ]


class UserVoteListView(generics.ListAPIView):
    """
    Returns authenticated user's voting history.
    """

    serializer_class = VoteSerializer

    def get_queryset(self):
        """
        Returns votes belonging to authenticated user.
        """

        return Vote.objects.select_related(
            "candidate",
            "position",
            "election",
        ).filter(voter=self.request.user)


class ElectionResultsView(APIView):
    """
    Returns aggregated election results.
    """

    def get(self, request, election_id):
        """
        Returns election result statistics.
        """

        results = ResultService.get_election_results(election_id)

        return success_response(
            message="Election results retrieved successfully.",
            data=results,
        )


class ElectionWinnersView(APIView):
    """
    Returns election winners per position.
    """

    def get(self, request, election_id):
        """
        Returns winners grouped by position.
        """

        winners = ResultService.get_position_winners(election_id)

        return Response(winners)


class ElectionStatisticsView(APIView):
    """
    Returns election analytics and statistics.
    """

    def get(self, request, election_id):
        """
        Returns election statistics.
        """

        statistics = ResultService.get_election_statistics(election_id)

        return Response(statistics)
