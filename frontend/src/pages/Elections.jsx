import { useEffect, useState } from "react";

import electionService from "../services/electionService";

/**

* Displays available SecureVote elections.
  */
  function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
let isMounted = true;


const loadElections = async () => {
  try {
    const data = await electionService.getElections();

    /**
     * Django REST Framework may return either:
     *
     * 1. An array:
     *    [...]
     *
     * 2. A paginated response:
     *    { results: [...] }
     */
    const electionList = Array.isArray(data)
      ? data
      : data.results || [];

    if (isMounted) {
      setElections(electionList);
    }
  } catch {
    if (isMounted) {
      setError(
        "Unable to load elections. Please try again.",
      );
    }
  } finally {
    if (isMounted) {
      setLoading(false);
    }
  }
};

loadElections();

return () => {
  isMounted = false;
};


}, []);

if (loading) {
return ( <section> <h1>Elections</h1> <p>Loading elections...</p> </section>
);
}

if (error) {
return ( <section> <h1>Elections</h1> <p role="alert">{error}</p> </section>
);
}

return ( <section> <h1>Elections</h1>


  {elections.length === 0 ? (
    <p>No elections are currently available.</p>
  ) : (
    <div>
      {elections.map((election) => (
        <article key={election.id}>
          <h2>{election.title}</h2>

          <p>{election.description}</p>

          <p>
            <strong>Status:</strong>{" "}
            {election.status}
          </p>

          <p>
            <strong>Starts:</strong>{" "}
            {new Date(
              election.start_date,
            ).toLocaleString()}
          </p>

          <p>
            <strong>Ends:</strong>{" "}
            {new Date(
              election.end_date,
            ).toLocaleString()}
          </p>
        </article>
      ))}
    </div>
  )}
</section>


);
}

export default Elections;
