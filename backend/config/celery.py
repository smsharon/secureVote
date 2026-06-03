"""
Celery application configuration for SecureVote.

This module initializes Celery and connects it to
Django settings for asynchronous task processing.
"""

import os

from celery import Celery

# Set default Django settings module
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings.development",
)

app = Celery("securevote")

# Load Celery settings from Django settings
app.config_from_object(
    "django.conf:settings",
    namespace="CELERY",
)

# Automatically discover tasks.py files
app.autodiscover_tasks()