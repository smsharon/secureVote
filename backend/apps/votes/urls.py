from django.urls import path

from apps.votes.views import (
    VoteCreateView,
    UserVoteListView,
    ElectionResultsView,
    ElectionWinnersView,
    ElectionStatisticsView,
)

urlpatterns = [
    path(
        "",
        VoteCreateView.as_view(),
        name="cast-vote",
    ),
    path(
        "my-votes/",
        UserVoteListView.as_view(),
        name="user-votes",
    ),
    path(
        "results/<int:election_id>/",
        ElectionResultsView.as_view(),
        name="election-results",
    ),
    path(
        "winners/<int:election_id>/",
        ElectionWinnersView.as_view(),
        name="election-winners",
    ),
    path(
        "statistics/<int:election_id>/",
        ElectionStatisticsView.as_view(),
        name="election-statistics",
    ),
]
