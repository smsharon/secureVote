
import apiClient from "../api/axios";

/**
 * Retrieves all registered voters for administration.
 *
 * @returns {Promise<Object>} Registered voter response.
 */
const getAdminVoters = async () => {
  const response = await apiClient.get(
    "/users/admin-voters/",
  );

  return response.data;
};

/**
 * Verifies a voter account.
 *
 * @param {string|number} voterId - Voter user ID.
 * @returns {Promise<Object>} Verification response.
 */
const verifyVoter = async (voterId) => {
  const response = await apiClient.post(
    `/users/admin-voters/${voterId}/verify/`,
  );

  return response.data;
};

const userService = {
  getAdminVoters,
  verifyVoter,
};

export default userService;
