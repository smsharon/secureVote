from django.urls import path

from apps.users.views import (
    AdminDashboardView,
    AdminVoterListView,
    CandidateUserListView,
    ChangePasswordView,
    CurrentUserView,
    LoginView,
    LogoutView,
    RefreshTokenView,
    UserRegistrationView,
    VerifiedVoterView,
    VerifyVoterView,
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
        "admin-voters/",
        AdminVoterListView.as_view(),
        name="admin-voters",
    ),
    path(
        "admin-voters/<int:pk>/verify/",
        VerifyVoterView.as_view(),
        name="verify-voter",
    ),

    path(
        "verified-voter/",
        VerifiedVoterView.as_view(),
        name="verified-voter",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="user-logout",
    ),

    path(
        "candidate-users/",
        CandidateUserListView.as_view(),
        name="candidate-users",
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
]
