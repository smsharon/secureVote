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
    Serializer for authenticated user profile details.
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

        read_only_fields = [
            "id",
            "role",
            "is_verified",
            "created_at",
        ]

    def validate_email(self, value):
        """
        Ensures the email remains unique when updating
        the current user's profile.
        """

        queryset = User.objects.filter(email=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value


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

class ChangePasswordSerializer(serializers.Serializer):
    """
    Validates a user's password change request.
    """

    old_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    new_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True,
    )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError(
                {"old_password": "Current password is incorrect."}
            )

        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError(
                {"new_password_confirm": "Passwords do not match."}
            )

        if attrs["old_password"] == attrs["new_password"]:
            raise serializers.ValidationError(
                {"new_password": "New password must be different from your current password."}
            )

        validate_password(
            attrs["new_password"],
            user=user,
        )

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user

        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])

        return user
