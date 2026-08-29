# Create your views here.
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.elections.models import Candidate, CandidateApplication, Election, Position
from apps.elections.serializers import (
    AdminCandidateApplicationSerializer,
    CandidateSerializer,
    CandidateApplicationSerializer,
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
    Handles candidate listing and creation.
    """


    queryset = Candidate.objects.select_related(
        "user",
        "position",
        "election",
    )

    serializer_class = CandidateSerializer

    def get_permissions(self):
        """
        Allows authenticated users to view candidates,
        while restricting candidate creation to admins.
        """

        if self.request.method == "POST":
            return [IsAdminUserRole()]

        return [IsAuthenticated()]

class CandidateApplicationListCreateView(
    generics.ListCreateAPIView
    ):
    """
    Allows authenticated voters to submit candidacy
    applications and view their own applications.
    """


    serializer_class = CandidateApplicationSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Returns only the authenticated user's applications.
        """

        return CandidateApplication.objects.select_related(
            "applicant",
            "election",
            "position",
            "reviewed_by",
        ).filter(
            applicant=self.request.user,
        )

    def perform_create(self, serializer):
        """
        Creates a pending application for the
        authenticated voter.
        """

        if self.request.user.role != self.request.user.Role.VOTER:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Only voters can submit candidacy applications."
            )

        serializer.save(
            applicant=self.request.user,
            status=CandidateApplication.Status.PENDING,
        )

class MyCandidateApplicationsView(
    generics.ListAPIView
    ):
    """
    Returns candidacy applications belonging to
    the authenticated user.
    """

    serializer_class = CandidateApplicationSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CandidateApplication.objects.select_related(
            "applicant",
            "election",
            "position",
            "reviewed_by",
        ).filter(
            applicant=self.request.user,
        )
    
class AdminCandidateApplicationListView(
    generics.ListAPIView
    ):
    """
    Allows administrators to review candidate
    applications.
    """

    serializer_class = AdminCandidateApplicationSerializer

    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        """
        Returns candidate applications for admin review.
        """

        queryset = CandidateApplication.objects.select_related(
            "applicant",
            "election",
            "position",
            "reviewed_by",
        )

        status_filter = self.request.query_params.get(
            "status"
        )

        if status_filter:
            queryset = queryset.filter(
                status=status_filter
            )

        return queryset
    







