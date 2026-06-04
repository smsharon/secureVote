"""
Initialize Celery application for SecureVote.
"""

from .celery import app as celery_app

__all__ = ("celery_app",)
