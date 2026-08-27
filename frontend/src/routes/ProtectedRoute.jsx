import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**

* Protects routes that require an authenticated user.
*
* Redirects unauthenticated users to the login page.
  */
  function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

/**

* Wait for authentication state to be initialized.
  */
  if (loading) {
  return <p>Loading...</p>;
  }

/**

* Redirect unauthenticated users to login.
*
* The current location is preserved so it can be
* used for redirecting after successful authentication.
  */
  if (!user) {
  return (
  <Navigate
  to="/login"
  replace
  state={{ from: location }}
  />
  );
  }

return <Outlet />;
}

export default ProtectedRoute;
