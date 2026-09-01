from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from drf_spectacular.utils import extend_schema

# Create your views here.
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.responses import success_response
from apps.elections.models import Election
from apps.users.permissions import IsAdminUserRole, IsVerifiedUser, IsVoterRole
from apps.votes.models import Vote
from apps.votes.serializers import VoteSerializer
from apps.votes.services import ResultService


@method_decorator(
    ratelimit(
        key="user",
        rate="10/m",
        method="POST",
        block=True,
    ),
    name="post",
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
        Returns election results only after
        the election has completed.
        """

        try:
            election = Election.objects.get(
                id=election_id
            )
        except Election.DoesNotExist:
            return Response(
                {"detail": "Election not found."},
                status=404,
            )

        if election.status != Election.Status.COMPLETED:
            return Response(
                {
                    "detail": (
                        "Election results are only "
                        "available after the election "
                        "has completed."
                    )
                },
                status=403,
            )

        results = ResultService.get_election_results(
            election_id
        )

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
        Returns winners only after the election
        has completed.
        """

        try:
            election = Election.objects.get(
                id=election_id
            )
        except Election.DoesNotExist:
            return Response(
                {"detail": "Election not found."},
                status=404,
            )

        if election.status != Election.Status.COMPLETED:
            return Response(
                {
                    "detail": (
                        "Election winners are only "
                        "available after the election "
                        "has completed."
                    )
                },
                status=403,
            )

        winners = ResultService.get_position_winners(
            election_id
        )

        return Response(winners)

class ElectionStatisticsView(APIView):
    """
    Returns election analytics and statistics.
    """
    permission_classes = [IsAdminUserRole]

    def get(self, request, election_id):
        """
        Returns election statistics.
        """

        statistics = ResultService.get_election_statistics(election_id)

        return Response(statistics)
