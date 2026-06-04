"""
Development settings.
"""

from .base import *  # noqa: F401,F403

DEBUG = True

import os

ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    ""
).split(",")

EMAIL_BACKEND = (
    "django.core.mail.backends.console.EmailBackend"
)

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]