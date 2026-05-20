from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from apps.users.views import (
    UserRegistrationView,
    CurrentUserView,
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
        TokenObtainPairView.as_view(),
        name="token-obtain-pair",
    ),

    # Refresh token
    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),

    # Current authenticated user
    path(
        "me/",
        CurrentUserView.as_view(),
        name="current-user",
    ),
]