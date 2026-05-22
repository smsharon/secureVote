from django.urls import path

from apps.elections.views import (
    CandidateListCreateView,
    ElectionListCreateView,
    PositionListCreateView,
)

urlpatterns = [
    path(
        "",
        ElectionListCreateView.as_view(),
        name="election-list-create",
    ),
    path(
        "positions/",
        PositionListCreateView.as_view(),
        name="position-list-create",
    ),
    path(
        "candidates/",
        CandidateListCreateView.as_view(),
        name="candidate-list-create",
    ),
]
