from apps.elections.models import Election


class ElectionService:
    """
    Service layer for election business logic.
    """

    @staticmethod
    def create_election(validated_data, user):
        """
        Creates election instance.
        """

        return Election.objects.create(
            created_by=user,
            **validated_data,
        )
