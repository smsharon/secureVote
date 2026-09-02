import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import electionService from "../services/electionService";
import voteService from "../services/voteService";
import { useAuth } from "../hooks/useAuth";

import "./VoterDashboard.css";

function VoterDashboard() {
  const { user } = useAuth();

  const [elections, setElections] = useState([]);
  const [myVotes, setMyVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const [electionData, voteData] = await Promise.all([
          electionService.getElections(),
          voteService.getMyVotes(),
        ]);

        if (!isMounted) {
          return;
        }

        setElections(Array.isArray(electionData) ? electionData : []);
        setMyVotes(Array.isArray(voteData) ? voteData : []);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          requestError.response?.data?.detail ||
            "Unable to load your voting dashboard."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeElections = useMemo(
    () =>
      elections.filter(
        (election) => election.status === "ONGOING"
      ),
    [elections]
  );

  const upcomingElections = useMemo(
    () =>
      elections.filter(
        (election) => election.status === "UPCOMING"
      ),
    [elections]
  );

  const completedElections = useMemo(
    () =>
      elections.filter(
        (election) => election.status === "COMPLETED"
      ),
    [elections]
  );

  const recentElection =
    activeElections[0] ||
    upcomingElections[0] ||
    completedElections[0];

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

  function getElectionAction(election) {
    if (election.status === "ONGOING") {
      return "Enter election";
    }

    if (election.status === "UPCOMING") {
      return "View election";
    }

    return "View results";
  }

  if (isLoading) {
    return (
      <section className="dashboard-loading">
        <span className="dashboard-loading-line" />
        <p>Preparing your voting space</p>
      </section>
    );
  }

  return (
    <div className="voter-dashboard">
      <section className="dashboard-intro">
        <div>
          <p className="dashboard-eyebrow">
            VOTER DASHBOARD
          </p>

          <h1>
            Welcome back,
            <br />
            <em>{user?.username || "Voter"}.</em>
          </h1>

          <p className="dashboard-intro-text">
            Your participation starts here. Review active elections,
            prepare for upcoming votes, and keep track of your
            participation.
          </p>
        </div>

        <div className="dashboard-index">
          <span>SECUREVOTE</span>
          <strong>01</strong>
          <span>VOTER SPACE</span>
        </div>
      </section>

      {error && (
        <div className="dashboard-error" role="alert">
          <span>!</span>
          {error}
        </div>
      )}

      <section className="dashboard-focus">
        <div className="section-heading">
          <div>
            <p className="dashboard-eyebrow">ATTENTION</p>
            <h2>What needs your attention</h2>
          </div>

          <span className="section-count">
            {activeElections.length} active
          </span>
        </div>

        {activeElections.length > 0 ? (
          <div className="focus-list">
            {activeElections.slice(0, 2).map((election, index) => (
              <article
                className="focus-election"
                key={election.id}
              >
                <div className="focus-number">
                  0{index + 1}
                </div>

                <div className="focus-content">
                  <div className="focus-meta">
                    <span className="status status-active">
                      Voting open
                    </span>

                    <span>
                      Ends {formatDate(election.end_date)}
                    </span>
                  </div>

                  <h3>{election.title}</h3>

                  <p>
                    {election.description ||
                      "An election is currently open for participation."}
                  </p>
                </div>

                <Link
                  className="focus-action"
                  to={`/elections/${election.id}`}
                >
                  <span>{getElectionAction(election)}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <span className="empty-mark">—</span>

            <div>
              <h3>No active elections</h3>
              <p>
                There are currently no elections requiring your
                participation.
              </p>
            </div>

            <Link to="/elections">
              Browse elections →
            </Link>
          </div>
        )}
      </section>

      <section className="dashboard-overview">
        <div className="dashboard-stat">
          <span className="stat-index">01</span>

          <strong>{activeElections.length}</strong>

          <div>
            <span>Active</span>
            <small>Open elections</small>
          </div>
        </div>

        <div className="dashboard-stat">
          <span className="stat-index">02</span>

          <strong>{upcomingElections.length}</strong>

          <div>
            <span>Upcoming</span>
            <small>Not yet open</small>
          </div>
        </div>

        <div className="dashboard-stat">
          <span className="stat-index">03</span>

          <strong>{myVotes.length}</strong>

          <div>
            <span>Participation</span>
            <small>Recorded votes</small>
          </div>
        </div>

        <div className="dashboard-stat">
          <span className="stat-index">04</span>

          <strong>{completedElections.length}</strong>

          <div>
            <span>Completed</span>
            <small>Finished elections</small>
          </div>
        </div>
      </section>

      <section className="dashboard-lower">
        <div className="dashboard-upcoming">
          <div className="section-heading compact">
            <div>
              <p className="dashboard-eyebrow">ON THE HORIZON</p>
              <h2>Upcoming elections</h2>
            </div>

            <Link to="/elections">
              View all →
            </Link>
          </div>

          {upcomingElections.length > 0 ? (
            <div className="upcoming-list">
              {upcomingElections.slice(0, 3).map((election) => (
                <Link
                  className="upcoming-item"
                  to={`/elections/${election.id}`}
                  key={election.id}
                >
                  <span className="upcoming-date">
                    {formatDate(election.start_date)}
                  </span>

                  <span className="upcoming-title">
                    {election.title}
                  </span>

                  <span className="upcoming-arrow">
                    →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="dashboard-muted">
              No upcoming elections have been scheduled.
            </p>
          )}
        </div>

        <aside className="dashboard-record">
          <p className="dashboard-eyebrow">YOUR RECORD</p>

          <h2>
            Participation
            <br />
            matters.
          </h2>

          <p>
            Your voting activity is kept as a participation record.
            Your individual selections remain separate from the
            public election results.
          </p>

          <Link to="/my-votes">
            View my votes
            <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </section>

      {recentElection && (
        <div className="dashboard-footer-note">
          <span>LAST CONTEXT</span>
          <strong>{recentElection.title}</strong>
          <span>
            {recentElection.status === "ONGOING"
              ? "Currently open"
              : recentElection.status === "UPCOMING"
                ? "Opening soon"
                : "Completed"}
          </span>
        </div>
      )}
    </div>
  );
}

export default VoterDashboard;