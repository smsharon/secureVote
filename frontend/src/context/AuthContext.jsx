import { useCallback, useEffect, useState } from "react";

import api from "../api/axios";
import { AuthContext } from "./authContext";

/**
 * Provides authentication state and actions to the application.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/users/me/");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const response = await api.get("/users/me/");

        if (isMounted) {
          setUser(response.data);
        }
      } catch {
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
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}