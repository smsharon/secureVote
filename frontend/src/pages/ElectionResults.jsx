
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import electionService from "../services/electionService";
import voteService from "../services/voteService";

/**
 * Displays results for a completed election.
 */
function ElectionResults() {
  const { id } = useParams();

  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [winners, setWinners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = useCallback(async () => {
    const [
      electionData,
      resultsData,
      winnersData,
    ] = await Promise.all([
      electionService.getElection(id),
      voteService.getElectionResults(id),
      voteService.getElectionWinners(id),
    ]);

    const resultList = Array.isArray(resultsData)
      ? resultsData
      : resultsData.data || resultsData.results || [];

    const winnerList = Array.isArray(winnersData)
      ? winnersData
      : winnersData.data || winnersData.results || [];

    setElection(electionData);
    setResults(resultList);
    setWinners(winnerList);
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        setError("");
        await loadResults();
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
  }, [loadResults]);

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

        <Link to={`/elections/${id}`}>
          ← Back to Election
        </Link>
      </main>
    );
  }

  if (!election) {
    return (
      <main>
        <h1>Election not found</h1>

        <Link to="/elections">
          ← Back to Elections
        </Link>
      </main>
    );
  }

  if (election.status !== "COMPLETED") {
    return (
      <main>
        <Link to={`/elections/${id}`}>
          ← Back to Election
        </Link>

        <h1>{election.title}</h1>

        <h2>Results Not Available</h2>

        <p>
          Election results will be available after
          voting has ended.
        </p>
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
      <Link to={`/elections/${id}`}>
        ← Back to Election
      </Link>

      <h1>{election.title} Results</h1>

      <p>
        Voting has ended. The results below represent
        the final vote totals.
      </p>

      <hr />

      <h2>Results by Position</h2>

      {Object.keys(groupedResults).length === 0 ? (
        <p>
          No votes were recorded for this election.
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
                      <strong>Votes:</strong>{" "}
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
                            key={candidate.candidate_id}
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

export default ElectionResults;