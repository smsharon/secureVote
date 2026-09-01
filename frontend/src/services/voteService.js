
import apiClient from "../api/axios";

/**
 * Retrieves the authenticated voter's voting history.
 *
 * @returns {Promise<Object>} Vote history response.
 */
const getMyVotes = async () => {
  const response = await apiClient.get("/votes/my-votes/");

  return response.data;
};

/**
 * Retrieves results for a completed election.
 *
 * @param {string|number} electionId - Election ID.
 * @returns {Promise<Object>} Election results.
 */
const getElectionResults = async (electionId) => {
  const response = await apiClient.get(
    `/votes/results/${electionId}/`,
  );

  return response.data;
};

/**
 * Retrieves winners for a completed election.
 *
 * @param {string|number} electionId - Election ID.
 * @returns {Promise<Object>} Election winners.
 */
const getElectionWinners = async (electionId) => {
  const response = await apiClient.get(
    `/votes/winners/${electionId}/`,
  );

  return response.data;
};

// Consolidated service export (defined once below).

/**
 * Retrieves administrative statistics for an election.
 *
 * @param {string|number} electionId - Election ID.
 * @returns {Promise<Object>} Election statistics.
 */
const getElectionStatistics = async (electionId) => {
  const response = await apiClient.get(
    `/votes/statistics/${electionId}/`,
  );

  return response.data;
};


const voteService = {
  getMyVotes,
  getElectionResults,
  getElectionWinners,
  getElectionStatistics,
};

export default voteService;