import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import electionService from "../services/electionService";

/**

* Displays an election and its positions and candidates
* to authenticated voters.
  */
  function ElectionDetails() {
  const { id } = useParams();

const [election, setElection] = useState(null);
const [positions, setPositions] = useState([]);
const [candidates, setCandidates] = useState([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadElectionData = useCallback(async () => {
const [
electionData,
positionsData,
candidatesData,
] = await Promise.all([
electionService.getElection(id),
electionService.getPositions(),
electionService.getCandidates(),
]);


const positionList = Array.isArray(positionsData)
  ? positionsData
  : positionsData.results || [];

const candidateList = Array.isArray(candidatesData)
  ? candidatesData
  : candidatesData.results || [];

const electionPositions = positionList.filter(
  (position) =>
    String(position.election) === String(id),
);

const electionCandidates = candidateList.filter(
  (candidate) =>
    String(candidate.election) === String(id),
);

setElection(electionData);
setPositions(electionPositions);
setCandidates(electionCandidates);


}, [id]);

useEffect(() => {
let cancelled = false;


async function initialize() {
  try {
    setError("");

    await loadElectionData();
  } catch {
    if (!cancelled) {
      setError(
        "Unable to load this election.",
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


}, [loadElectionData]);

if (loading) {
return ( <main> <p>Loading election...</p> </main>
);
}

if (error) {
return ( <main> <p role="alert">{error}</p>

    <Link to="/elections">
      ← Back to Elections
    </Link>
  </main>
);


}

if (!election) {
return ( <main> <h1>Election not found</h1>


    <Link to="/elections">
      ← Back to Elections
    </Link>
  </main>
);


}

return ( <main> <Link to="/elections">
← Back to Elections </Link>


  <h1>{election.title}</h1>

  <p>{election.description}</p>

  <p>
    <strong>Status:</strong>{" "}
    {election.status}
  </p>

  <hr />

  <h2>Positions</h2>

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

        return (
          <section key={position.id}>
            <h3>{position.title}</h3>

            {position.description && (
              <p>{position.description}</p>
            )}

            <p>
              Maximum votes:{" "}
              {position.max_votes}
            </p>

            <h4>Candidates</h4>

            {positionCandidates.length === 0 ? (
              <p>
                No candidates have been
                added yet.
              </p>
            ) : (
              <div>
                {positionCandidates.map(
                  (candidate) => (
                    <article
                      key={candidate.id}
                    >
                      <h5>
                        {candidate.user}
                      </h5>

                      {candidate.image && (
                        <img
                          src={
                            candidate.image
                          }
                          alt={`${candidate.user} candidate`}
                          width="120"
                        />
                      )}

                      <p>
                        {candidate.manifesto}
                      </p>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  )}
</main>


);
}

export default ElectionDetails;
