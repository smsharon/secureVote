"""
Development settings.
"""

import os

from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1",
).split(",")

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
