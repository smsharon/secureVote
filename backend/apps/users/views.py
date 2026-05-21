from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.users.serializers import (
    UserRegistrationSerializer,
    UserSerializer,
)

from rest_framework.views import APIView
from rest_framework.response import Response

from apps.users.permissions import (
    IsAdminUserRole,
)

from apps.users.permissions import (
    IsVoterRole,
    IsVerifiedUser,
)

from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
)

@extend_schema(
    summary="Register a new user",

    description=(
        "Creates a new voter account."
    ),

    responses={
        201: UserSerializer,

        400: OpenApiResponse(
            description="Validation error."
        ),
    },
)
class UserRegistrationView(
    generics.CreateAPIView
):
    """
    API endpoint for user registration.
    """

    serializer_class = UserRegistrationSerializer

    permission_classes = [AllowAny]

class CurrentUserView(generics.RetrieveAPIView):
    """
    Returns details of the authenticated user.
    """

    serializer_class = UserSerializer

    def get_object(self):
        """
        Returns current authenticated user.
        """

        return self.request.user    

class AdminDashboardView(APIView):
    """
    Example admin-only endpoint.
    """

    permission_classes = [IsAdminUserRole]

    def get(self, request):
        """
        Returns admin dashboard data.
        """

        return Response(
            {
                "message":
                "Welcome to the admin dashboard."
            }
        )      

class VerifiedVoterView(APIView):
    """
    Endpoint accessible only to verified voters.
    """

    permission_classes = [
        IsVoterRole,
        IsVerifiedUser,
    ]

    def get(self, request):
        """
        Returns verified voter response.
        """

        return Response(
            {
                "message":
                "You are a verified voter."
            }
        )          