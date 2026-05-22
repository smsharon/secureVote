from rest_framework.exceptions import ValidationError


def validate_election_dates(
    start_date,
    end_date,
):
    """
    Validates election date consistency.
    """

    if start_date >= end_date:
        raise ValidationError(
            {"end_date": "End date must be after start date."}
        )
