
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import voteService from "../services/voteService";

/**
 * Displays the authenticated voter's voting history.
 */
function MyVotes() {
  const [votes, setVotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadVotes() {
      try {
        setError("");

        const data = await voteService.getMyVotes();

        const voteList = Array.isArray(data)
          ? data
          : data.results || [];

        if (!cancelled) {
          setVotes(voteList);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load your voting history.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVotes();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main>
        <p>Loading your voting history...</p>
      </main>
    );
  }

  return (
    <main>
      <Link to="/dashboard">
        ← Back to Dashboard
      </Link>

      <h1>My Votes</h1>

      <p>
        View the elections and positions where you
        have cast your votes.
      </p>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {!error && votes.length === 0 && (
        <section>
          <p>
            You have not cast any votes yet.
          </p>

          <Link to="/elections">
            Browse Elections
          </Link>
        </section>
      )}

      {votes.length > 0 && (
        <section>
          <h2>Voting History</h2>

          {votes.map((vote) => (
            <article key={vote.id}>
            <h3>
                {vote.election_title}
            </h3>

            <p>
                <strong>Position:</strong>{" "}
                {vote.position_title}
            </p>

            <p>
                <strong>Candidate:</strong>{" "}
                {vote.candidate_name}
            </p>

            <p>
                <strong>Voted at:</strong>{" "}
                {new Date(
                vote.created_at,
                ).toLocaleString("en-KE", {
                timeZone: "Africa/Nairobi",
                })}
            </p>

            <hr />
            </article>

          ))}
        </section>
      )}
    </main>
  );
}

export default MyVotes;
