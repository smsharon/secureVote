from django.urls import path

from apps.votes.views import (
    VoteCreateView,
    UserVoteListView,
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
]