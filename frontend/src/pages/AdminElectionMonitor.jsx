import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import electionService from "../services/electionService";
import voteService from "../services/voteService";

function AdminElectionMonitor() {
  const { id } = useParams();

  const [election, setElection] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMonitorData = async () => {
      try {
        setLoading(true);
        setError("");

        const [electionResponse, statisticsResponse] =
          await Promise.all([
            electionService.getElection(id),
            voteService.getElectionStatistics(id),
          ]);

        setElection(
          electionResponse?.data || electionResponse,
        );

        setStatistics(
          statisticsResponse?.data || statisticsResponse,
        );
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load election monitoring data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMonitorData();
  }, [id]);

  if (loading) {
    return <p>Loading election monitoring...</p>;
  }

  if (error) {
    return (
      <section>
        <h1>Election Monitoring</h1>
        <p>{error}</p>
        <Link to="/admin/elections">Back to Elections</Link>
      </section>
    );
  }

  if (!election) {
    return <p>Election not found.</p>;
  }

  const statusLabels = {
    UPCOMING: "Upcoming",
    ONGOING: "Voting in Progress",
    COMPLETED: "Completed",
  };

  return (
    <section>
      <h1>{election.title}</h1>

      <p>
        <strong>Status:</strong>{" "}
        {statusLabels[election.status] || election.status}
      </p>

      <p>
        <strong>Voting started:</strong>{" "}
        {new Date(election.start_date).toLocaleString()}
      </p>

      <p>
        <strong>Voting ends:</strong>{" "}
        {new Date(election.end_date).toLocaleString()}
      </p>

      <hr />

      <h2>Participation</h2>

      <div>
        <strong>Votes Cast</strong>
        <p>{statistics?.total_votes ?? 0}</p>
      </div>

      <div>
        <strong>Candidates</strong>
        <p>{statistics?.total_candidates ?? 0}</p>
      </div>

      <p>
        Live candidate vote counts are hidden while voting is
        in progress. Final results become available after the
        election is completed.
      </p>

      {election.status === "COMPLETED" && (
        <Link to={`/admin/elections/${id}/results`}>
          View Final Results
        </Link>
      )}

      <br />

      <Link to="/admin/elections">Back to Elections</Link>
    </section>
  );
}

export default AdminElectionMonitor;