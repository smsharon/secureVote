from django.shortcuts import render

# Create your views here.
from rest_framework import generics

from apps.elections.models import (
    Election,
    Position,
    Candidate,
)

from apps.elections.serializers import (
    ElectionSerializer,
    PositionSerializer,
    CandidateSerializer,
)

from apps.users.permissions import (
    IsAdminUserRole,
)

class ElectionListCreateView(
    generics.ListCreateAPIView
):
    """
    Handles election listing and creation.
    """

    queryset = Election.objects.select_related(
        "created_by"
    )

    serializer_class = ElectionSerializer

    def get_permissions(self):
        """
        Assigns permissions dynamically.
        """

        if self.request.method == "POST":
            return [IsAdminUserRole()]

        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Assigns creator automatically.
        """

        serializer.save(
            created_by=self.request.user
        )

class PositionListCreateView(
    generics.ListCreateAPIView
):
    """
    Handles position listing and creation.
    """

    queryset = Position.objects.select_related(
        "election"
    )

    serializer_class = PositionSerializer

    permission_classes = [IsAdminUserRole]

class CandidateListCreateView(
    generics.ListCreateAPIView
):
    """
    Handles candidate listing and creation.
    """

    queryset = Candidate.objects.select_related(
        "user",
        "position",
        "election",
    )

    serializer_class = CandidateSerializer

    permission_classes = [IsAdminUserRole]            

