from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    Admin configuration for custom user model.
    """

    list_display = (
        "id",
        "username",
        "email",
        "role",
        "is_verified",
        "is_staff",
    )

    search_fields = (
        "username",
        "email",
    )

    list_filter = (
        "role",
        "is_verified",
        "is_staff",
    )
