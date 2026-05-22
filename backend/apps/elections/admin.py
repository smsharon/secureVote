from django.contrib import admin

from apps.elections.models import (
    Election,
    Position,
    Candidate,
)


@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
    """
    Admin configuration for elections.
    """

    list_display = (
        "id",
        "title",
        "status",
        "start_date",
        "end_date",
    )

    search_fields = ("title",)

    list_filter = ("status",)


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    """
    Admin configuration for positions.
    """

    list_display = (
        "id",
        "title",
        "election",
    )


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    """
    Admin configuration for candidates.
    """

    list_display = (
        "id",
        "user",
        "position",
        "election",
    )
