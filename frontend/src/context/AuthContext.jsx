import { useCallback, useEffect, useState } from "react";

import authService from "../services/authService";
import { AuthContext } from "./authContext";

/**
 * Provides authentication state and actions to the application.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Retrieves the currently authenticated user.
   */
  const loadCurrentUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();

      setUser(userData);

      return userData;
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
  * Registers a new SecureVote user.
  *
  * @param {Object} userData - User registration details.
  * @returns {Promise<Object>} Newly created user data.
  */
  const register = useCallback(async (userData) => {
    return authService.register(userData);
  }, []);

  /**
   * Authenticates a user and stores the JWT tokens.
   *
   * @param {Object} credentials - User email and password.
   * @returns {Promise<Object>} Authentication response.
   */
  const login = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      await loadCurrentUser();

      return data;
    },
    [loadCurrentUser],
  );

  /**
   * Logs the current user out.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  }, []);

  /**
   * Initializes authentication state when the application starts.
   */
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        if (isMounted) {
          setLoading(false);
        }

        return;
      }

      try {
        const userData = await authService.getCurrentUser();

        if (isMounted) {
          setUser(userData);
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}