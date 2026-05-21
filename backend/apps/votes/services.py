from django.db import transaction

from apps.votes.models import Vote

class VoteService:
    """
    Service layer responsible for secure vote casting.
    """

    @staticmethod
    @transaction.atomic
    def cast_vote(validated_data, voter):
        """
        Casts vote atomically.

        Atomic transactions ensure database consistency
        and prevent partial writes or race-condition issues.
        """

        return Vote.objects.create(
            voter=voter,
            **validated_data,
        )