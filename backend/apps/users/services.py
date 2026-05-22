from django.contrib.auth import get_user_model

User = get_user_model()


class UserService:
    """
    Service layer for user-related business logic.
    """

    @staticmethod
    def create_user(validated_data):
        """
        Creates a new user account securely.
        """

        password = validated_data.pop("password")

        validated_data.pop("password_confirm")

        user = User(**validated_data)

        user.set_password(password)

        user.save()

        return user
