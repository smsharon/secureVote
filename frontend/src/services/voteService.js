
import apiClient from "../api/axios";

/**
 * Casts a vote for a candidate.
 *
 * @param {Object} voteData - Election, position,
 * and candidate information.
 * @returns {Promise<Object>} Created vote.
 */
const castVote = async (voteData) => {
  const response = await apiClient.post(
    "/votes/",
    voteData,
  );

  return response.data;
};

/**
 * Retrieves the authenticated voter's voting history.
 *
 * @returns {Promise<Object>} Vote history response.
 */
const getMyVotes = async () => {
  const response = await apiClient.get(
    "/votes/my-votes/",
  );

  return response.data;
};

const voteService = {
  castVote,
  getMyVotes,
};

export default voteService;