import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import electionService from "../services/electionService";

/**

* Admin page for managing positions within an election.
  */
  function AdminPositions() {
  const { id } = useParams();

const [election, setElection] = useState(null);
const [positions, setPositions] = useState([]);

const [formData, setFormData] = useState({
title: "",
description: "",
max_votes: 1,
});

const [loading, setLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

/**

* Loads the selected election and its positions.
  */
  const loadData = useCallback(async () => {
  try {
  setError("");

  const [electionsData, positionsData] =
  await Promise.all([
  electionService.getElections(),
  electionService.getPositions(),
  ]);

  const electionList = Array.isArray(electionsData)
  ? electionsData
  : electionsData.results || [];

  const positionList = Array.isArray(positionsData)
  ? positionsData
  : positionsData.results || [];

  const selectedElection = electionList.find(
  (item) => String(item.id) === String(id),
  );

  const electionPositions = positionList.filter(
  (position) =>
  String(position.election) === String(id),
  );

  setElection(selectedElection || null);
  setPositions(electionPositions);
  } catch {
  setError(
  "Unable to load election information.",
  );
  } finally {
  setLoading(false);
  }
  }, [id]);

useEffect(() => {
let cancelled = false;


async function initialize() {
  try {
    setError("");

    const [electionsData, positionsData] =
      await Promise.all([
        electionService.getElections(),
        electionService.getPositions(),
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

    const selectedElection = electionList.find(
      (item) => String(item.id) === String(id),
    );

    const electionPositions = positionList.filter(
      (position) =>
        String(position.election) === String(id),
    );

    setElection(selectedElection || null);
    setPositions(electionPositions);
  } catch {
    if (!cancelled) {
      setError(
        "Unable to load election information.",
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


}, [id]);

/**

* Handles form field changes.
  */
  function handleChange(event) {
  const { name, value } = event.target;


setFormData((previousData) => ({



  ...previousData,
  [name]:
    name === "max_votes"
      ? Number(value)
      : value,
}));


}

/**

* Creates a new position.
  */
  async function handleSubmit(event) {
  event.preventDefault();


setError("");



setSuccess("");
setIsSubmitting(true);

try {
  await electionService.createPosition({
    election: Number(id),
    title: formData.title,
    description: formData.description,
    max_votes: formData.max_votes,
  });

  setFormData({
    title: "",
    description: "",
    max_votes: 1,
  });

  setSuccess("Position created successfully.");

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
      messages || "Unable to create position.",
    );
  } else {
    setError(
      "Unable to create position. Please try again.",
    );
  }
} finally {
  setIsSubmitting(false);
}


}

if (loading) {
return <p>Loading election...</p>;
}

if (!election) {
return ( <section> <h1>Election Not Found</h1>


    <p>
      The requested election could not be found.
    </p>

    <Link to="/admin/elections">
      ← Back to Elections
    </Link>
  </section>
);


}

return ( <section> <h1>Manage Positions</h1>


  <p>
    Manage positions for:
  </p>

  <h2>{election.title}</h2>

  <Link to="/admin/elections">
    ← Back to Elections
  </Link>

  <hr />

  <h2>Create Position</h2>

  {error && <p role="alert">{error}</p>}

  {success && (
    <p role="status">{success}</p>
  )}

  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="title">
        Position title
      </label>

      <input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. President"
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
        placeholder="Describe this position..."
      />
    </div>

    <div>
      <label htmlFor="max_votes">
        Maximum votes
      </label>

      <input
        id="max_votes"
        name="max_votes"
        type="number"
        min="1"
        value={formData.max_votes}
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
        : "Create Position"}
    </button>
  </form>

  <hr />

  <h2>Positions</h2>

  {positions.length === 0 ? (
    <p>
      No positions have been created for this
      election yet.
    </p>
  ) : (
    <div>
      {positions.map((position) => (
        <article key={position.id}>
          <h3>{position.title}</h3>

          {position.description && (
            <p>{position.description}</p>
          )}

          <p>
            <strong>Maximum votes:</strong>{" "}
            {position.max_votes}
          </p>
        </article>
      ))}
    </div>
  )}
</section>


);
}

export default AdminPositions;
