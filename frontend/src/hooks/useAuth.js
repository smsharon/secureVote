import { useContext } from "react";

import { AuthContext } from "../context/authContext";

/**
 * Provides access to authentication state.
 */
export function useAuth() {
  return useContext(AuthContext);
}