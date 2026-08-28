import apiClient from "../api/axios";

/**

* Retrieves all elections.
*
* @returns {Promise<Object>} Election response.
  */
  const getElections = async () => {
  const response = await apiClient.get("/elections/");

return response.data;
};

/**

* Creates a new election.
*
* @param {Object} electionData - Election information.
* @returns {Promise<Object>} Created election.
  */
  const createElection = async (electionData) => {
  const response = await apiClient.post(
  "/elections/",
  electionData,
  );

return response.data;
};

/**

* Retrieves all positions.
*
* @returns {Promise<Object>} Position response.
  */
  const getPositions = async () => {
  const response = await apiClient.get(
  "/elections/positions/",
  );

return response.data;
};

/**

* Creates a position for an election.
*
* @param {Object} positionData - Position information.
* @returns {Promise<Object>} Created position.
  */
  const createPosition = async (positionData) => {
  const response = await apiClient.post(
  "/elections/positions/",
  positionData,
  );

return response.data;
};

/**

* Retrieves all candidates.
*
* @returns {Promise<Object>} Candidate response.
  */
  const getCandidates = async () => {
  const response = await apiClient.get(
  "/elections/candidates/",
  );

return response.data;
};

const electionService = {
getElections,
createElection,
getPositions,
createPosition,
getCandidates,
};

export default electionService;
