from django.db import transaction
from django.db.models import Count

from apps.elections.models import Candidate, Election
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


class ResultService:
    """
    Service layer responsible for
    election result computations.
    """

    @staticmethod
    def get_election_results(election_id):
        """
        Returns aggregated results for election.
        """

        queryset = (
            Candidate.objects.filter(election_id=election_id)
            .select_related(
                "user",
                "position",
            )
            .annotate(total_votes=Count("votes"))
            .order_by(
                "position__title",
                "-total_votes",
            )
        )

        results = []

        for candidate in queryset:
            results.append(
                {
                    "candidate_id": candidate.id,
                    "candidate_name": candidate.user.username,
                    "position": candidate.position.title,
                    "total_votes": candidate.total_votes,
                }
            )

        return results

    @staticmethod
    def get_position_winners(election_id):
        """
        Determines winner or tie per position.
        """

        election = Election.objects.prefetch_related(
            "positions"
        ).get(id=election_id)

        winners = []

        for position in election.positions.all():
            candidates = list(
                Candidate.objects.filter(
                    election_id=election_id,
                    position=position,
                )
                .select_related("user")
                .annotate(total_votes=Count("votes"))
                .order_by("-total_votes")
            )

            if not candidates:
                continue

            highest_vote_count = candidates[0].total_votes

            top_candidates = [
                candidate
                for candidate in candidates
                if candidate.total_votes == highest_vote_count
            ]

            if len(top_candidates) == 1:
                winners.append(
                    {
                        "position": position.title,
                        "result": "WINNER",
                        "winner": top_candidates[0].user.username,
                        "total_votes": highest_vote_count,
                    }
                )
            else:
                winners.append(
                    {
                        "position": position.title,
                        "result": "TIE",
                        "winner": None,
                        "total_votes": highest_vote_count,
                        "tied_candidates": [
                            {
                                "candidate_id": candidate.id,
                                "candidate_name": (
                                    candidate.user.username
                                ),
                                "total_votes": candidate.total_votes,
                            }
                            for candidate in top_candidates
                        ],
                    }
                )

        return winners


    @staticmethod
    def get_election_statistics(election_id):
        """
        Returns high-level election analytics.
        """

        total_votes = Vote.objects.filter(election_id=election_id).count()

        total_candidates = Candidate.objects.filter(election_id=election_id).count()

        return {
            "total_votes": total_votes,
            "total_candidates": total_candidates,
        }
