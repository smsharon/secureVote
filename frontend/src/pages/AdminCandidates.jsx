import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import electionService from "../services/electionService";

function AdminCandidates() {
const [elections, setElections] = useState([]);
const [positions, setPositions] = useState([]);
const [users, setUsers] = useState([]);
const [candidates, setCandidates] = useState([]);

const [formData, setFormData] = useState({
election: "",
position: "",
user: "",
manifesto: "",
});

const [loading, setLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const loadData = useCallback(async () => {
try {
setError("");


  const [
    electionsData,
    positionsData,
    usersData,
    candidatesData,
  ] = await Promise.all([
    electionService.getElections(),
    electionService.getPositions(),
    electionService.getCandidateUsers(),
    electionService.getCandidates(),
  ]);

  const electionList = Array.isArray(electionsData)
    ? electionsData
    : electionsData.results || [];

  const positionList = Array.isArray(positionsData)
    ? positionsData
    : positionsData.results || [];

  const userList = Array.isArray(usersData)
    ? usersData
    : usersData.results || [];

  const candidateList = Array.isArray(candidatesData)
    ? candidatesData
    : candidatesData.results || [];

  setElections(electionList);
  setPositions(positionList);
  setUsers(userList);
  setCandidates(candidateList);
} catch {
  setError(
    "Unable to load candidate management data.",
  );
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
let cancelled = false;

async function initialize() {
  try {
    const [
      electionsData,
      positionsData,
      usersData,
      candidatesData,
    ] = await Promise.all([
      electionService.getElections(),
      electionService.getPositions(),
      electionService.getCandidateUsers(),
      electionService.getCandidates(),
    ]);

    if (cancelled) {
      return;
    }

    const electionList = Array.isArray(electionsData)
      ? electionsData
      : electionsData.results || [];

    const positionList = Array.isArray(positionsData)
      ? positionsData
      : positionsData.results || [];

    const userList = Array.isArray(usersData)
      ? usersData
      : usersData.results || [];

    const candidateList = Array.isArray(candidatesData)
      ? candidatesData
      : candidatesData.results || [];

    setElections(electionList);
    setPositions(positionList);
    setUsers(userList);
    setCandidates(candidateList);
  } catch {
    if (!cancelled) {
      setError(
        "Unable to load candidate management data.",
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

function handleChange(event) {
const { name, value } = event.target;


setFormData((previousData) => {
  if (name === "election") {
    return {
      ...previousData,
      election: value,
      position: "",
    };
  }

  return {
    ...previousData,
    [name]: value,
  };
});


}

async function handleSubmit(event) {
event.preventDefault();


setError("");
setSuccess("");
setIsSubmitting(true);

try {
  await electionService.createCandidate({
    election: Number(formData.election),
    position: Number(formData.position),
    user: Number(formData.user),
    manifesto: formData.manifesto,
  });

  setFormData({
    election: "",
    position: "",
    user: "",
    manifesto: "",
  });

  setSuccess(
    "Candidate created successfully.",
  );

  await loadData();
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
      messages || "Unable to create candidate.",
    );
  } else {
    setError(
      "Unable to create candidate. Please try again.",
    );
  }
} finally {
  setIsSubmitting(false);
}


}

const selectedElectionId = formData.election;

const filteredPositions = positions.filter(
(position) =>
String(position.election) ===
String(selectedElectionId),
);

if (loading) {
return <p>Loading candidate management...</p>;
}

return ( <main> <Link to="/admin">
← Admin Dashboard </Link>


  <h1>Manage Candidates</h1>

  <p>
    Create and manage candidates for your
    elections.
  </p>

  {error && (
    <p role="alert">{error}</p>
  )}

  {success && (
    <p role="status">{success}</p>
  )}

  <section>
    <h2>Add Candidate</h2>

    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="election">
          Election
        </label>

        <select
          id="election"
          name="election"
          value={formData.election}
          onChange={handleChange}
          required
        >
          <option value="">
            Select an election
          </option>

          {elections.map((election) => (
            <option
              key={election.id}
              value={election.id}
            >
              {election.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="position">
          Position
        </label>

        <select
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          disabled={!formData.election}
          required
        >
          <option value="">
            Select a position
          </option>

          {filteredPositions.map(
            (position) => (
              <option
                key={position.id}
                value={position.id}
              >
                {position.title}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label htmlFor="user">
          Candidate
        </label>

        <select
          id="user"
          name="user"
          value={formData.user}
          onChange={handleChange}
          required
        >
          <option value="">
            Select a user
          </option>

          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >
              {user.username} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="manifesto">
          Manifesto
        </label>

        <textarea
          id="manifesto"
          name="manifesto"
          value={formData.manifesto}
          onChange={handleChange}
          rows="6"
          placeholder="Enter the candidate's manifesto..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Creating..."
          : "Add Candidate"}
      </button>
    </form>
  </section>

  <hr />

  <section>
    <h2>Current Candidates</h2>

    {candidates.length === 0 ? (
      <p>
        No candidates have been created yet.
      </p>
    ) : (
      candidates.map((candidate) => {
        const candidatePosition =
          positions.find(
            (position) =>
              String(position.id) ===
              String(candidate.position),
          );

        const candidateElection =
          elections.find(
            (election) =>
              String(election.id) ===
              String(candidate.election),
          );

        return (
          <article key={candidate.id}>
            <h3>
              {candidate.username}
            </h3>

            <p>
              <strong>Election:</strong>{" "}
              {candidateElection?.title ||
                "Unknown"}
            </p>

            <p>
              <strong>Position:</strong>{" "}
              {candidatePosition?.title ||
                "Unknown"}
            </p>

            <p>
              <strong>Manifesto:</strong>{" "}
              {candidate.manifesto}
            </p>

            <hr />
          </article>
        );
      })
    )}
  </section>
</main>


);
}

export default AdminCandidates;
