from django.apps import AppConfig


class ElectionsConfig(AppConfig):
    """
    Configuration class for the elections application.
    """

    default_auto_field = "django.db.models.BigAutoField"

    name = "apps.elections"