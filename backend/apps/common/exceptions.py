from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Standardizes API error responses.
    """

    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {
                "success": False,
                "message": "An unexpected error occurred.",
                "errors": [],
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            "success": False,
            "message": "Request failed.",
            "errors": response.data,
        },
        status=response.status_code,
    )
