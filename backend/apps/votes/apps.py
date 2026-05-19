from django.apps import AppConfig


class VotesConfig(AppConfig):
    """
    Configuration class for the votes application.
    """

    default_auto_field = "django.db.models.BigAutoField"

    name = "apps.votes"