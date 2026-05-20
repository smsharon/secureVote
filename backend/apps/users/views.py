from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.users.serializers import (
    UserRegistrationSerializer,
    UserSerializer,
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