import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

function CandidacyApplication() {
const navigate = useNavigate();

const [elections, setElections] = useState([]);
const [positions, setPositions] = useState([]);

const [selectedElection, setSelectedElection] = useState("");
const [selectedPosition, setSelectedPosition] = useState("");

const [manifesto, setManifesto] = useState("");
const [image, setImage] = useState(null);

const [applications, setApplications] = useState([]);

const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

useEffect(() => {
const loadData = async () => {
try {
const [electionsResponse, applicationsResponse] =
await Promise.all([
apiClient.get("elections/"),
apiClient.get(
"elections/candidate-applications/my/"
),
]);

    setElections(
      electionsResponse.data.results ||
        electionsResponse.data
    );

    setApplications(
      applicationsResponse.data.results ||
        applicationsResponse.data
    );
  } catch (err) {
    setError(
      err.response?.data?.detail ||
        "Failed to load candidacy information."
    );
  } finally {
    setLoading(false);
  }
};

loadData();

}, []);

useEffect(() => {
const loadPositions = async () => {
if (!selectedElection) {
setPositions([]);
setSelectedPosition("");
return;
}

  try {
    const response = await apiClient.get(
      "elections/positions/"
    );

    const allPositions =
      response.data.results || response.data;

    const electionPositions = allPositions.filter(
      (position) =>
        Number(position.election) ===
        Number(selectedElection)
    );

    setPositions(electionPositions);
    setSelectedPosition("");
  } catch (err) {
    setError(
      err.response?.data?.detail ||
        "Failed to load positions."
    );
  }
};

loadPositions();

}, [selectedElection]);

const handleSubmit = async (event) => {
event.preventDefault();

setError("");
setSuccess("");

if (!selectedElection || !selectedPosition) {
  setError(
    "Please select an election and position."
  );
  return;
}

if (!manifesto.trim()) {
  setError("Please provide your manifesto.");
  return;
}

setSubmitting(true);

try {
  const formData = new FormData();

  formData.append(
    "election",
    selectedElection
  );

  formData.append(
    "position",
    selectedPosition
  );

  formData.append(
    "manifesto",
    manifesto.trim()
  );

  if (image) {
    formData.append("image", image);
  }

  const response = await apiClient.post(
    "elections/candidate-applications/",
    formData
  );

  setApplications((current) => [
    response.data,
    ...current,
  ]);

  setSelectedElection("");
  setSelectedPosition("");
  setPositions([]);
  setManifesto("");
  setImage(null);

  const fileInput =
    document.getElementById("candidate-image");

  if (fileInput) {
    fileInput.value = "";
  }

  setSuccess(
    "Your candidacy application has been submitted."
  );
} catch (err) {
  const responseData = err.response?.data;

  if (typeof responseData === "object") {
    const firstError = Object.values(
      responseData
    ).flat()[0];

    setError(
      firstError ||
        "Failed to submit your application."
    );
  } else {
    setError(
      "Failed to submit your application."
    );
  }
} finally {
  setSubmitting(false);
}


};

if (loading) {
return <p>Loading candidacy information...</p>;
}

return ( <div> <h1>Run for a Position</h1>

  <p>
    Submit your candidacy application for an
    available election position.
  </p>

  {error && (
    <div role="alert">
      {error}
    </div>
  )}

  {success && (
    <div role="status">
      {success}
    </div>
  )}

  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="election">
        Election
      </label>

      <select
        id="election"
        value={selectedElection}
        onChange={(event) =>
          setSelectedElection(event.target.value)
        }
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
        value={selectedPosition}
        onChange={(event) =>
          setSelectedPosition(event.target.value)
        }
        disabled={!selectedElection}
      >
        <option value="">
          Select a position
        </option>

        {positions.map((position) => (
          <option
            key={position.id}
            value={position.id}
          >
            {position.title}
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
        value={manifesto}
        onChange={(event) =>
          setManifesto(event.target.value)
        }
        placeholder="Explain your goals and what you intend to achieve..."
        rows={8}
        required
      />
    </div>

    <div>
      <label htmlFor="candidate-image">
        Candidate Photo (optional)
      </label>

      <input
        id="candidate-image"
        type="file"
        accept="image/*"
        onChange={(event) =>
          setImage(
            event.target.files?.[0] || null
          )
        }
      />
    </div>

    <button
      type="submit"
      disabled={submitting}
    >
      {submitting
        ? "Submitting..."
        : "Submit Candidacy"}
    </button>
  </form>

  <hr />

  <section>
    <h2>My Applications</h2>

    {applications.length === 0 ? (
      <p>
        You have not submitted any candidacy
        applications yet.
      </p>
    ) : (
      applications.map((application) => (
        <article key={application.id}>
          <h3>
            {application.position}
          </h3>

          <p>
            <strong>Election:</strong>{" "}
            {application.election}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {application.status}
          </p>

          {application.status ===
            "REJECTED" &&
            application.rejection_reason && (
              <p>
                <strong>
                  Reason:
                </strong>{" "}
                {application.rejection_reason}
              </p>
            )}
        </article>
      ))
    )}
  </section>

  <button
    type="button"
    onClick={() => navigate("/dashboard")}
  >
    Back to Dashboard
  </button>
</div>

);
}

export default CandidacyApplication;
