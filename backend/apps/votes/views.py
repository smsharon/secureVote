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


class VoteCreateView(
    generics.CreateAPIView
):
    """
    Secure endpoint for casting votes.
    """

    serializer_class = VoteSerializer

    permission_classes = [
        IsVoterRole,
        IsVerifiedUser,
    ]

class UserVoteListView(
    generics.ListAPIView
):
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
        ).filter(
            voter=self.request.user
        )    