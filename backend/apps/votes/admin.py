from django.contrib import admin

from apps.votes.models import Vote


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    """
    Admin configuration for votes.
    """

    list_display = (
        "id",
        "voter",
        "candidate",
        "position",
        "election",
        "created_at",
    )

    search_fields = (
        "voter__username",
        "candidate__user__username",
    )

    list_filter = (
        "election",
        "position",
    )
