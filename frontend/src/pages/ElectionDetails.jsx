
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import electionService from "../services/electionService";
import voteService from "../services/voteService";

/**
 * Displays an election, its positions, and
 * approved candidates to authenticated voters.
 */
function ElectionDetails() {
  const { id } = useParams();

  const [election, setElection] = useState(null);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [votedPositions, setVotedPositions] = useState({});

  const [loading, setLoading] = useState(true);
  const [submittingPosition, setSubmittingPosition] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const loadElectionData = useCallback(async () => {
  const [
    electionData,
    positionsData,
    candidatesData,
    votesData,
  ] = await Promise.all([
    electionService.getElection(id),
    electionService.getPositions(),
    electionService.getCandidates(),
    voteService.getMyVotes(),
  ]);

  const positionList = Array.isArray(positionsData)
    ? positionsData
    : positionsData.results || [];

  const candidateList = Array.isArray(candidatesData)
    ? candidatesData
    : candidatesData.results || [];

  const voteList = Array.isArray(votesData)
    ? votesData
    : votesData.results || [];

  const electionPositions = positionList.filter(
    (position) =>
      String(position.election) === String(id),
  );

  const electionCandidates = candidateList.filter(
    (candidate) =>
      String(candidate.election) === String(id),
  );

  const electionVotes = voteList.filter(
    (vote) =>
      String(vote.election) === String(id),
  );

  const existingVotes = {};

  electionVotes.forEach((vote) => {
    existingVotes[vote.position] = true;
  });

  setElection(electionData);
  setPositions(electionPositions);
  setCandidates(electionCandidates);
  setVotedPositions(existingVotes);
}, [id]);


  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        setError("");

        await loadElectionData();
      } catch {
        if (!cancelled) {
          setError("Unable to load this election.");
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
  }, [loadElectionData]);

  const handleCandidateChange = (
    positionId,
    candidateId,
  ) => {
    setSelectedCandidates((current) => ({
      ...current,
      [positionId]: candidateId,
    }));
  };

  const handleVote = async (
    position,
    candidateId,
  ) => {
    setError("");
    setSuccess("");

    if (!candidateId) {
      setError(
        `Please select a candidate for ${position.title}.`,
      );
      return;
    }

    setSubmittingPosition(position.id);

    try {
      await voteService.castVote({
        election: election.id,
        position: position.id,
        candidate: candidateId,
      });

      setVotedPositions((current) => ({
        ...current,
        [position.id]: true,
      }));

      setSuccess(
        `Your vote for ${position.title} has been submitted successfully.`,
      );
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData?.detail) {
        setError(responseData.detail);
      } else if (responseData?.vote) {
        setError(responseData.vote);
      } else if (responseData?.election) {
        setError(responseData.election);
      } else {
        setError(
          `Unable to submit your vote for ${position.title}.`,
        );
      }
    } finally {
      setSubmittingPosition(null);
    }
  };

  if (loading) {
    return (
      <main>
        <p>Loading election...</p>
      </main>
    );
  }

  if (error && !election) {
    return (
      <main>
        <p role="alert">{error}</p>

        <Link to="/elections">
          ← Back to Elections
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

  const electionIsActive =
    election.status === "ONGOING";

  return (
    <main>
      <Link to="/elections">
        ← Back to Elections
      </Link>

      <h1>{election.title}</h1>

      <p>{election.description}</p>

      <p>
        <strong>Status:</strong>{" "}
        {election.status}
      </p>

      {election.status === "UPCOMING" && (
        <p>
          Voting has not started yet.
        </p>
      )}

      {election.status === "COMPLETED" && (
        <p>
          Voting for this election has ended.
        </p>
      )}

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

      <hr />

      <h2>Positions & Candidates</h2>

      {positions.length === 0 ? (
        <p>
          No positions have been added to this
          election yet.
        </p>
      ) : (
        <div>
          {positions.map((position) => {
            const positionCandidates =
              candidates.filter(
                (candidate) =>
                  String(candidate.position) ===
                  String(position.id),
              );

            const hasVoted =
              votedPositions[position.id];

            const selectedCandidate =
              selectedCandidates[position.id];

            return (
              <section key={position.id}>
                <h3>{position.title}</h3>

                {position.description && (
                  <p>{position.description}</p>
                )}

                <p>
                  <strong>
                    Maximum votes:
                  </strong>{" "}
                  {position.max_votes}
                </p>

                <h4>Candidates</h4>

                {positionCandidates.length === 0 ? (
                  <p>
                    No approved candidates are
                    available for this position yet.
                  </p>
                ) : (
                  <div>
                    {positionCandidates.map(
                      (candidate) => (
                        <article
                          key={candidate.id}
                        >
                          <label>
                            <input
                              type="radio"
                              name={`position-${position.id}`}
                              value={candidate.id}
                              checked={
                                String(
                                  selectedCandidate,
                                ) ===
                                String(
                                  candidate.id,
                                )
                              }
                              onChange={() =>
                                handleCandidateChange(
                                  position.id,
                                  candidate.id,
                                )
                              }
                              disabled={
                                !electionIsActive ||
                                hasVoted ||
                                submittingPosition ===
                                  position.id
                              }
                            />

                            {" "}
                            <strong>
                              {candidate.username}
                            </strong>
                          </label>

                          {candidate.image && (
                            <div>
                              <img
                                src={
                                  candidate.image
                                }
                                alt={`${candidate.username} candidate`}
                                width="120"
                              />
                            </div>
                          )}

                          <p>
                            <strong>
                              Manifesto:
                            </strong>
                          </p>

                          <p>
                            {candidate.manifesto}
                          </p>
                        </article>
                      ),
                    )}
                  </div>
                )}

                {electionIsActive &&
                  positionCandidates.length > 0 && (
                    <button
                      type="button"
                      disabled={
                        hasVoted ||
                        submittingPosition ===
                          position.id
                      }
                      onClick={() =>
                        handleVote(
                          position,
                          selectedCandidate,
                        )
                      }
                    >
                      {submittingPosition ===
                      position.id
                        ? "Submitting..."
                        : hasVoted
                          ? "Vote Submitted"
                          : `Vote for ${position.title}`}
                    </button>
                  )}

                {hasVoted && (
                  <p role="status">
                    ✓ You have already voted for
                    this position.
                  </p>
                )}

                <hr />
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default ElectionDetails;
