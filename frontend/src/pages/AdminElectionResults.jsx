
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import electionService from "../services/electionService";
import voteService from "../services/voteService";

/**
 * Displays election results and statistics
 * to administrators.
 */
function AdminElectionResults() {
  const { id } = useParams();

  const [election, setElection] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [results, setResults] = useState([]);
  const [winners, setWinners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    const [
      electionData,
      statisticsData,
      resultsData,
      winnersData,
    ] = await Promise.all([
      electionService.getElection(id),
      voteService.getElectionStatistics(id),
      voteService.getElectionResults(id),
      voteService.getElectionWinners(id),
    ]);

    const resultList = Array.isArray(resultsData)
      ? resultsData
      : resultsData.data || resultsData.results || [];

    const winnerList = Array.isArray(winnersData)
      ? winnersData
      : winnersData.data || winnersData.results || [];

    const stats =
      statisticsData.data || statisticsData;

    setElection(electionData);
    setStatistics(stats);
    setResults(resultList);
    setWinners(winnerList);
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        setError("");
        await loadData();
      } catch (err) {
        if (!cancelled) {
          const responseData = err.response?.data;

          setError(
            responseData?.detail ||
              "Unable to load election results.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [loadData]);

  if (loading) {
    return (
      <main>
        <p>Loading election results...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>

        <Link to="/admin/elections">
          ← Back to Elections
        </Link>
      </main>
    );
  }

  if (!election) {
    return (
      <main>
        <h1>Election not found</h1>

        <Link to="/admin/elections">
          ← Back to Elections
        </Link>
      </main>
    );
  }

  const groupedResults = results.reduce(
    (groups, result) => {
      const position = result.position;

      if (!groups[position]) {
        groups[position] = [];
      }

      groups[position].push(result);

      return groups;
    },
    {},
  );

  return (
    <main>
      <Link to="/admin/elections">
        ← Back to Elections
      </Link>

      <h1>{election.title}</h1>

      <p>{election.description}</p>

      <p>
        <strong>Status:</strong>{" "}
        {election.status}
      </p>

      <hr />

      <h2>Election Statistics</h2>

      {statistics && (
        <section>
          <p>
            <strong>Total votes:</strong>{" "}
            {statistics.total_votes}
          </p>

          <p>
            <strong>Total candidates:</strong>{" "}
            {statistics.total_candidates}
          </p>
        </section>
      )}

      <hr />

      <h2>Results by Position</h2>

      {Object.keys(groupedResults).length === 0 ? (
        <p>
          No votes have been recorded for this
          election.
        </p>
      ) : (
        Object.entries(groupedResults).map(
          ([position, positionResults]) => {
            const winner = winners.find(
              (item) => item.position === position,
            );

            return (
              <section key={position}>
                <h3>{position}</h3>

                {positionResults.map((result) => (
                  <article key={result.candidate_id}>
                    <h4>{result.candidate_name}</h4>

                    <p>
                      <strong>
                        Votes:
                      </strong>{" "}
                      {result.total_votes}
                    </p>
                  </article>
                ))}

                {winner?.result === "WINNER" && (
                  <p role="status">
                    🏆 Winner:{" "}
                    <strong>{winner.winner}</strong>{" "}
                    with {winner.total_votes} votes.
                  </p>
                )}

                {winner?.result === "TIE" && (
                  <div>
                    <p role="status">
                      This position resulted in a tie.
                    </p>

                    <strong>
                      Tied candidates:
                    </strong>

                    <ul>
                      {winner.tied_candidates.map(
                        (candidate) => (
                          <li
                            key={
                              candidate.candidate_id
                            }
                          >
                            {candidate.candidate_name} —{" "}
                            {candidate.total_votes} votes
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                <hr />
              </section>
            );
          },
        )
      )}
    </main>
  );
}

export default AdminElectionResults;