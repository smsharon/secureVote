from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


class AuthenticatedAPITestCase:
    """
    Base class for authenticated API tests.
    """

    client = APIClient()

    def authenticate(self, user):
        """
        Authenticates test client using JWT.
        """

        refresh = RefreshToken.for_user(user)

        access_token = str(refresh.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=(f"Bearer {access_token}"))
