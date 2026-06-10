from django_ratelimit.exceptions import Ratelimited
from rest_framework import status
from rest_framework.exceptions import Throttled
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Standardizes API error responses and handles rate-limiting exceptions.
    """
    # 1. Convert django-ratelimit exception into a DRF Throttled exception
    if isinstance(exc, Ratelimited):
        exc = Throttled(detail="Too many requests. Please try again later.")

    # 2. Get the default DRF response layout
    response = exception_handler(exc, context)

    # 3. Handle unexpected (500) server errors
    if response is None:
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred.",
                "errors": [],
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # 4. Return standardized structure for expected API errors (e.g., 400, 403, 429)
    return Response(
        {
            "success": False,
            "message": "Request failed.",
            "errors": response.data,
        },
        status=response.status_code,
    )
