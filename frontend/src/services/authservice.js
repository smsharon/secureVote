import apiClient from "../api/axios";

/**
 * Registers a new SecureVote user.
 *
 * @param {Object} userData - User registration details.
 * @returns {Promise<Object>} The newly created user data.
 */
const register = async (userData) => {
  const response = await apiClient.post("/users/register/", userData);

  return response.data;
};

/**
 * Authenticates a user and obtains JWT tokens.
 *
 * @param {Object} credentials - User login credentials.
 * @returns {Promise<Object>} Access and refresh tokens.
 */
const login = async (credentials) => {
  const response = await apiClient.post("/users/login/", credentials);

  return response.data;
};

/**
 * Retrieves the currently authenticated user's details.
 *
 * @returns {Promise<Object>} The authenticated user's data.
 */
const getCurrentUser = async () => {
  const response = await apiClient.get("/users/me/");

  return response.data;
};

/**
 * Obtains a new access token using a refresh token.
 *
 * @param {string} refreshToken - The user's refresh token.
 * @returns {Promise<Object>} A new access token.
 */
const refreshToken = async (refreshToken) => {
  const response = await apiClient.post("/users/token/refresh/", {
    refresh: refreshToken,
  });

  return response.data;
};

const authService = {
  register,
  login,
  getCurrentUser,
  refreshToken,
};

export default authService;