
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import electionService from "../services/electionService";

/**
 * Converts a datetime-local value entered by the admin
 * into an ISO UTC datetime for the Django API.
 */
function localDateTimeToISO(value) {
  if (!value) {
    return "";
  }

  return `${value}:00+03:00`;
}

/**
 * Admin page for managing elections.
 */
function AdminElections() {
  const [elections, setElections] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Loads all elections.
   */
  const loadElections = useCallback(async () => {
    try {
      setError("");

      const data = await electionService.getElections();

      const electionList = Array.isArray(data)
        ? data
        : data.results || [];

      setElections(electionList);
    } catch {
      setError(
        "Unable to load elections. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeElections() {
      try {
        setError("");

        const data = await electionService.getElections();

        if (cancelled) {
          return;
        }

        const electionList = Array.isArray(data)
          ? data
          : data.results || [];

        setElections(electionList);
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load elections. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeElections();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Handles form field changes.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  /**
   * Handles election creation.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        start_date: localDateTimeToISO(formData.start_date),
        end_date: localDateTimeToISO(formData.end_date),
      };

      await electionService.createElection(payload);

      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
      });

      setSuccess("Election created successfully.");

      await loadElections();
    } catch (error) {
      const responseData = error.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const messages = Object.entries(responseData)
          .map(([field, message]) => {
            const value = Array.isArray(message)
              ? message.join(" ")
              : message;

            return `${field}: ${value}`;
          })
          .join(" ");

        setError(
          messages || "Unable to create election.",
        );
      } else {
        setError(
          "Unable to create election. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Manage Elections</h1>

      <p>
        Create and manage SecureVote elections.
      </p>

      <Link to="/admin">
        ← Back to Admin Dashboard
      </Link>

      <hr />

      <h2>Create Election</h2>

      {error && <p role="alert">{error}</p>}

      {success && (
        <p role="status">{success}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            Election title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="start_date">
            Start date and time
          </label>

          <input
            id="start_date"
            name="start_date"
            type="datetime-local"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="end_date">
            End date and time
          </label>

          <input
            id="end_date"
            name="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating..."
            : "Create Election"}
        </button>
      </form>

      <hr />

      <h2>Existing Elections</h2>

      {loading ? (
        <p>Loading elections...</p>
      ) : elections.length === 0 ? (
        <p>No elections have been created yet.</p>
      ) : (
        <div>
          {elections.map((election) => (
            <article key={election.id}>
              <h3>{election.title}</h3>

              <p>{election.description}</p>

              <p>
                <strong>Status:</strong>{" "}
                {election.status === "UPCOMING"
                  ? "Upcoming"
                  : election.status === "ONGOING"
                    ? "Voting in Progress"
                    : "Completed"}
              </p>

              <p>
                <strong>Starts:</strong>{" "}
                {new Date(
                  election.start_date,
                ).toLocaleString("en-KE", {
                  timeZone: "Africa/Nairobi",
                })}
              </p>

              <p>
                <strong>Ends:</strong>{" "}
                {new Date(
                  election.end_date,
                ).toLocaleString("en-KE", {
                  timeZone: "Africa/Nairobi",
                })}
              </p>

              <div>
                {election.status === "UPCOMING" && (
                  <Link
                    to={`/admin/elections/${election.id}/positions`}
                  >
                    Configure Election
                  </Link>
                )}

                {election.status === "ONGOING" && (
                  <Link
                    to={`/admin/elections/${election.id}/results`}
                  >
                    Monitor Election
                  </Link>
                )}

                {election.status === "COMPLETED" && (
                  <Link
                    to={`/admin/elections/${election.id}/results`}
                  >
                    View Results & Statistics
                  </Link>
                )}
              </div>

              <div>
                <Link
                  to={`/admin/elections/${election.id}/results`}
                >
                  View Results & Statistics
                </Link>
              </div>

            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminElections;
