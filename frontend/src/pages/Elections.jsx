import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import electionService from "../services/electionService";

import "./Elections.css";

function Elections() {
  const [elections, setElections] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadElections() {
      try {
        setIsLoading(true);
        setError("");

        const data = await electionService.getElections();

        if (isMounted) {
          setElections(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.detail ||
              "Unable to load elections."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadElections();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredElections = useMemo(() => {
    if (filter === "ALL") {
      return elections;
    }

    return elections.filter(
      (election) => election.status === filter
    );
  }, [elections, filter]);

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateValue));
  }

  function getStatusLabel(status) {
    const labels = {
      UPCOMING: "Upcoming",
      ONGOING: "Voting open",
      COMPLETED: "Completed",
    };

    return labels[status] || status;
  }

  function getActionLabel(status) {
    if (status === "ONGOING") {
      return "Vote now";
    }

    if (status === "COMPLETED") {
      return "View results";
    }

    return "View election";
  }

  if (isLoading) {
    return (
      <section className="elections-loading">
        <span />
        <p>Loading elections</p>
      </section>
    );
  }

  return (
    <div className="elections-page">
      <header className="elections-header">
        <div>
          <p className="elections-eyebrow">
            ELECTION DIRECTORY
          </p>

          <h1>
            Elections
            <br />
            <em>that matter.</em>
          </h1>

          <p className="elections-header-text">
            Review current, upcoming, and completed elections.
            Select an election to see its positions and candidates.
          </p>
        </div>

        <div className="elections-header-index">
          <span>INDEX</span>
          <strong>
            {String(elections.length).padStart(2, "0")}
          </strong>
          <span>RECORDS</span>
        </div>
      </header>

      {error && (
        <div className="elections-error" role="alert">
          <span>!</span>
          {error}
        </div>
      )}

      <div className="elections-toolbar">
        <div className="election-filters">
          {[
            ["ALL", "All"],
            ["ONGOING", "Open"],
            ["UPCOMING", "Upcoming"],
            ["COMPLETED", "Completed"],
          ].map(([value, label]) => (
            <button
              className={
                filter === value
                  ? "election-filter active"
                  : "election-filter"
              }
              key={value}
              type="button"
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <span className="elections-result-count">
          {filteredElections.length}{" "}
          {filteredElections.length === 1
            ? "election"
            : "elections"}
        </span>
      </div>

      {filteredElections.length > 0 ? (
        <section className="election-directory">
          {filteredElections.map((election, index) => (
            <article
              className="election-directory-item"
              key={election.id}
            >
              <div className="election-directory-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="election-directory-main">
                <div className="election-directory-meta">
                  <span
                    className={`status election-status election-status-${election.status.toLowerCase()}`}
                  >
                    {getStatusLabel(election.status)}
                  </span>

                  <span>
                    {formatDate(election.start_date)}
                    {" — "}
                    {formatDate(election.end_date)}
                  </span>
                </div>

                <h2>{election.title}</h2>

                <p>
                  {election.description ||
                    "Election information is available here."}
                </p>
              </div>

              <Link
                className="election-directory-action"
                to={`/elections/${election.id}`}
              >
                <span>
                  {getActionLabel(election.status)}
                </span>

                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="elections-empty">
          <span>—</span>

          <h2>No elections found</h2>

          <p>
            There are no elections matching the selected filter.
          </p>
        </section>
      )}
    </div>
  );
}

export default Elections;