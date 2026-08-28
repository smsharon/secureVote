from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.services import UserService

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer responsible for validating
    and creating new user accounts.
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
    )

    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
    )

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "password",
            "password_confirm",
        ]

    def validate_email(self, value):
        """
        Ensures email uniqueness.
        """

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return value

    def validate(self, attrs):
        """
        Performs cross-field validation.
        """

        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        if password != password_confirm:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )

        validate_password(password)

        return attrs

    def create(self, validated_data):
        """
        Creates user through service layer.
        """

        return UserService.create_user(validated_data)


# USER PROFILE SERIALIZER


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for authenticated user details.
    """

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_verified",
            "created_at",
        ]


class LogoutSerializer(serializers.Serializer):
    """

    Blacklists a refresh token during logout.
    """

    refresh = serializers.CharField()

    def save(self, **kwargs):
        """
        Blacklist refresh token.
        """

        token = RefreshToken(self.validated_data["refresh"])

        token.blacklist()

class CandidateUserSerializer(serializers.ModelSerializer):
    """
    Safe user representation for selecting candidates.
    """


    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
        ]

