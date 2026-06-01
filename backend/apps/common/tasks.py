"""
Background tasks for shared application utilities.
"""

from celery import shared_task


@shared_task
def health_check_task():
    """
    Execute a simple health check task.

    Used to verify Celery worker functionality.
    """
    return "Celery is working correctly."