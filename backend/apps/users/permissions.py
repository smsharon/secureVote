from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    """
    Allows access only to users with ADMIN role.
    """

    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        """
        Checks whether authenticated user is an admin.
        """

        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsVoterRole(BasePermission):
    """
    Allows access only to users with VOTER role.
    """

    message = "Only voters can perform this action."

    def has_permission(self, request, view):
        """
        Checks whether authenticated user is a voter.
        """

        return request.user.is_authenticated and request.user.role == "VOTER"


class IsVerifiedUser(BasePermission):
    """
    Allows access only to verified users.
    """

    message = "Your account is not verified."

    def has_permission(self, request, view):
        """
        Checks whether user account is verified.
        """

        return request.user.is_authenticated and request.user.is_verified


class IsOwnerOrAdmin(BasePermission):
    """
    Allows access to resource owners or admins.
    """

    message = "You can only access your own resources."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        """
        Object-level permission check.
        """

        return request.user.is_admin or obj == request.user
