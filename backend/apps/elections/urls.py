from django.urls import path

from apps.elections.views import (
    AdminCandidateApplicationListView,
    ApproveCandidateApplicationView,
    CandidateApplicationListCreateView,
    CandidateListCreateView,
    ElectionListCreateView,
    MyCandidateApplicationsView,
    PositionListCreateView,
    RejectCandidateApplicationView,
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

    path(
        "candidate-applications/",
        CandidateApplicationListCreateView.as_view(),
        name="candidate-application-list-create",
    ),
    path(
        "candidate-applications/my/",
        MyCandidateApplicationsView.as_view(),
        name="my-candidate-applications",
    ),

    path(
        "candidate-applications/admin/",
        AdminCandidateApplicationListView.as_view(),
        name="admin-candidate-application-list",
    ),

    path(
        "candidate-applications/<int:pk>/approve/",
        ApproveCandidateApplicationView.as_view(),
        name="candidate-application-approve",
    ),
    path(
        "candidate-applications/<int:pk>/reject/",
        RejectCandidateApplicationView.as_view(),
        name="candidate-application-reject",
    ),

]
