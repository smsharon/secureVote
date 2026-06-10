from django.urls import path

from apps.users.views import (
    AdminDashboardView,
    CurrentUserView,
    LoginView,
    RefreshTokenView,
    UserRegistrationView,
    VerifiedVoterView,
)

urlpatterns = [
    # Registration
    path(
        "register/",
        UserRegistrationView.as_view(),
        name="user-register",
    ),
    # Login
    path(
        "login/",
        LoginView.as_view(),
        name="token-obtain-pair",
    ),
    # Refresh token
    path(
        "token/refresh/",
        RefreshTokenView.as_view(),
        name="token-refresh",
    ),
    # Current authenticated user
    path(
        "me/",
        CurrentUserView.as_view(),
        name="current-user",
    ),
    path(
        "admin-dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),
    path(
        "verified-voter/",
        VerifiedVoterView.as_view(),
        name="verified-voter",
    ),
]
