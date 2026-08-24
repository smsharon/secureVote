import axios from "axios";

/**
 * Configured Axios client for communicating with the SecureVote API.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;