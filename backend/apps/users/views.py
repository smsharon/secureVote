from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from drf_spectacular.utils import OpenApiResponse, extend_schema

# Create your views here.
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from apps.users.permissions import IsAdminUserRole, IsVerifiedUser, IsVoterRole
from apps.users.serializers import (
    LogoutSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)


@method_decorator(
    ratelimit(
        key="ip",
        rate="5/m",
        method="POST",
        block=True,
    ),
    name="post",
)
@extend_schema(
    summary="Register a new user",
    description=("Creates a new voter account."),
    responses={
        201: UserSerializer,
        400: OpenApiResponse(description="Validation error."),
    },
)
class UserRegistrationView(generics.CreateAPIView):
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

        return Response({"message": "Welcome to the admin dashboard."})


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

        return Response({"message": "You are a verified voter."})


@method_decorator(
    ratelimit(
        key="ip",
        rate="5/m",
        method="POST",
        block=True,
    ),
    name="post",
)
class LoginView(TokenObtainPairView):
    """
    JWT authentication endpoint.

    Limits login attempts to prevent
    brute-force attacks.
    """


@method_decorator(
    ratelimit(
        key="ip",
        rate="20/m",
        method="POST",
        block=True,
    ),
    name="post",
)
class RefreshTokenView(TokenRefreshView):
    """
    JWT refresh endpoint.
    Limits refresh token requests.
    """


class LogoutView(APIView):
    """
    Logout authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Blacklist refresh token.
        """

        serializer = LogoutSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {"detail": "Logged out successfully."},
            status=status.HTTP_205_RESET_CONTENT,
        )
