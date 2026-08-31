import { useEffect, useState } from "react";
import apiClient from "../api/axios";

function AdminCandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [rejectionReasons, setRejectionReasons] = useState({});

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        `elections/candidate-applications/admin/?status=${statusFilter}`,
      );

      setApplications(
        response.data.results || response.data,
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load candidate applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const handleApprove = async (applicationId) => {
    setActionLoading(applicationId);
    setError("");

    try {
      await apiClient.post(
        `elections/candidate-applications/${applicationId}/approve/`,
      );

      await loadApplications();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to approve application.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId) => {
    const reason = rejectionReasons[applicationId]?.trim();

    if (!reason) {
      setError(
        "Please provide a rejection reason.",
      );
      return;
    }

    setActionLoading(applicationId);
    setError("");

    try {
      await apiClient.post(
        `elections/candidate-applications/${applicationId}/reject/`,
        {
          rejection_reason: reason,
        },
      );

      await loadApplications();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to reject application.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <p>Loading candidate applications...</p>;
  }

  return (
    <div>
      <h1>Candidate Applications</h1>

      <p>
        Review voter applications and approve or reject
        candidates.
      </p>

      {error && (
        <div role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="status-filter">
          Status:
        </label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>
      </div>

      <hr />

      {applications.length === 0 ? (
        <p>
          No {statusFilter.toLowerCase()} candidate
          applications found.
        </p>
      ) : (
        applications.map((application) => (
          <article key={application.id}>
            <h2>
              {application.applicant}
            </h2>

            <p>
              <strong>Election:</strong>{" "}
              {application.election}
            </p>

            <p>
              <strong>Position:</strong>{" "}
              {application.position}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            <p>
              <strong>Manifesto:</strong>
            </p>

            <p>{application.manifesto}</p>

            {application.image && (
              <div>
                <img
                  src={application.image}
                  alt={`${application.applicant} candidate`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {application.status === "REJECTED" &&
              application.rejection_reason && (
                <p>
                  <strong>
                    Rejection reason:
                  </strong>{" "}
                  {application.rejection_reason}
                </p>
              )}

            {application.status === "PENDING" && (
              <div>
                <button
                  type="button"
                  disabled={
                    actionLoading === application.id
                  }
                  onClick={() =>
                    handleApprove(application.id)
                  }
                >
                  {actionLoading === application.id
                    ? "Processing..."
                    : "Approve"}
                </button>

                <div>
                  <label
                    htmlFor={`reason-${application.id}`}
                  >
                    Rejection reason
                  </label>

                  <textarea
                    id={`reason-${application.id}`}
                    rows={3}
                    value={
                      rejectionReasons[
                        application.id
                      ] || ""
                    }
                    onChange={(event) =>
                      setRejectionReasons(
                        (current) => ({
                          ...current,
                          [application.id]:
                            event.target.value,
                        }),
                      )
                    }
                    placeholder="Explain why this application is being rejected..."
                  />

                  <button
                    type="button"
                    disabled={
                      actionLoading === application.id
                    }
                    onClick={() =>
                      handleReject(application.id)
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            <hr />
          </article>
        ))
      )}
    </div>
  );
}

export default AdminCandidateApplications;