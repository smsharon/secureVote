# Create your views here.
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.elections.models import Candidate, Election, Position
from apps.elections.serializers import (
    CandidateSerializer,
    ElectionSerializer,
    PositionSerializer,
)
from apps.users.permissions import IsAdminUserRole


@method_decorator(
    ratelimit(
        key="user",
        rate="20/h",
        method="POST",
        block=True,
    ),
    name="post",
)
class ElectionListCreateView(generics.ListCreateAPIView):
    """
    Handles election listing and creation.
    """

    queryset = Election.objects.select_related("created_by")

    serializer_class = ElectionSerializer

    def get_permissions(self):
        """
        Assigns permissions based on the HTTP method.

        ```
        GET:
            Any authenticated user can view elections.

        POST:
            Only administrators can create elections.
        """

        if self.request.method == "POST":
            return [IsAdminUserRole()]

        return [IsAuthenticated()]



    def perform_create(self, serializer):
        """
        Assigns creator automatically.
        """

        serializer.save(created_by=self.request.user)


class PositionListCreateView(generics.ListCreateAPIView):
    """
    Handles election position listing and creation.

    
    Authenticated users can view positions.
    Only administrators can create positions.
    """

    queryset = Position.objects.select_related("election")

    serializer_class = PositionSerializer

    def get_permissions(self):
        """
        Assigns permissions based on the HTTP method.

        GET:
            Any authenticated user can view positions.

        POST:
            Only administrators can create positions.
        """

        if self.request.method == "POST":
            return [IsAdminUserRole()]

        return [IsAuthenticated()]
    


class CandidateListCreateView(generics.ListCreateAPIView):
    """
    Handles election candidate listing and creation.

  
    Authenticated users can view candidates.
    Only administrators can create candidates.
    """

    queryset = Candidate.objects.select_related(
        "user",
        "position",
        "election",
    )

    serializer_class = CandidateSerializer

    def get_permissions(self):
        """
        Assigns permissions based on the HTTP method.

        GET:
            Any authenticated user can view candidates.

        POST:
            Only administrators can create candidates.
        """

        if self.request.method == "POST":
            return [IsAdminUserRole()]

        return [IsAuthenticated()]


