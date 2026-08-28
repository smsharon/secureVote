import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import electionService from "../services/electionService";

/**

* Displays details for a single election.
  */
  function ElectionDetails() {
  const { id } = useParams();

const [election, setElection] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
let isMounted = true;


const loadElection = async () => {
  try {
    const data = await electionService.getElections();

    const electionList = Array.isArray(data)
      ? data
      : data.results || [];

    const selectedElection = electionList.find(
      (item) => String(item.id) === String(id),
    );

    if (!selectedElection) {
      throw new Error("Election not found.");
    }

    if (isMounted) {
      setElection(selectedElection);
    }
  } catch {
    if (isMounted) {
      setError(
        "Unable to load this election. Please try again.",
      );
    }
  } finally {
    if (isMounted) {
      setLoading(false);
    }
  }
};

loadElection();

return () => {
  isMounted = false;
};


}, [id]);

if (loading) {
return ( <section> <p>Loading election...</p> </section>
);
}

if (error) {
return ( <section> <h1>Election</h1>


    <p role="alert">{error}</p>

    <Link to="/elections">
      Back to Elections
    </Link>
  </section>
);


}

return ( <section> <Link to="/elections">
← Back to Elections </Link>


  <h1>{election.title}</h1>

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

  {election.status === "ONGOING" && (
    <p>
      This election is currently open.
    </p>
  )}

  {election.status === "UPCOMING" && (
    <p>
      This election has not started yet.
    </p>
  )}

  {election.status === "COMPLETED" && (
    <p>
      This election has ended.
    </p>
  )}
</section>


);
}

export default ElectionDetails;
