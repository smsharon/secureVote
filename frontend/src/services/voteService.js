
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

const voteService = {
  getMyVotes,
};

export default voteService;
