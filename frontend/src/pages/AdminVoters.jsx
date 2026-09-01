
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import userService from "../services/userService";

/**
 * Admin page for managing voter verification.
 */
function AdminVoters() {
  const [voters, setVoters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadVoters = useCallback(async () => {
    try {
      setError("");

      const data = await userService.getAdminVoters();

      const voterList = Array.isArray(data)
        ? data
        : data.results || [];

      setVoters(voterList);
    } catch {
      setError(
        "Unable to load registered voters.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        setError("");

        const data =
          await userService.getAdminVoters();

        if (cancelled) {
          return;
        }

        const voterList = Array.isArray(data)
          ? data
          : data.results || [];

        setVoters(voterList);
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load registered voters.",
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
  }, []);

  async function handleVerify(voterId) {
    setError("");
    setSuccess("");
    setVerifyingId(voterId);

    try {
      await userService.verifyVoter(voterId);

      setSuccess(
        "Voter verified successfully.",
      );

      await loadVoters();
    } catch (error) {
      const responseData = error.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const messages = Object.entries(
          responseData,
        )
          .map(([field, message]) => {
            const value = Array.isArray(message)
              ? message.join(" ")
              : message;

            return `${field}: ${value}`;
          })
          .join(" ");

        setError(
          messages ||
            "Unable to verify voter.",
        );
      } else {
        setError(
          "Unable to verify voter. Please try again.",
        );
      }
    } finally {
      setVerifyingId(null);
    }
  }

  return (
    <section>
      <Link to="/admin">
        ← Back to Admin Dashboard
      </Link>

      <h1>Manage Voters</h1>

      <p>
        Review registered voters and verify their
        accounts before they can vote.
      </p>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {success && (
        <p role="status">
          {success}
        </p>
      )}

      {loading ? (
        <p>Loading voters...</p>
      ) : voters.length === 0 ? (
        <p>
          No registered voters found.
        </p>
      ) : (
        <div>
          {voters.map((voter) => (
            <article key={voter.id}>
              <h2>
                {voter.username}
              </h2>

              <p>
                <strong>Email:</strong>{" "}
                {voter.email}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {voter.is_verified
                  ? "Verified"
                  : "Pending verification"}
              </p>

              {!voter.is_verified && (
                <button
                  type="button"
                  onClick={() =>
                    handleVerify(voter.id)
                  }
                  disabled={
                    verifyingId === voter.id
                  }
                >
                  {verifyingId === voter.id
                    ? "Verifying..."
                    : "Verify Voter"}
                </button>
              )}

              {voter.is_verified && (
                <p>
                  ✓ This voter is verified and
                  can vote.
                </p>
              )}

              <hr />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminVoters;
