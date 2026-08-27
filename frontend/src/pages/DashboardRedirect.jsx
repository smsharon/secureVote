import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**

* Redirects authenticated users to the dashboard
* appropriate for their role.
  */
  function DashboardRedirect() {
  const { user } = useAuth();

if (user?.role === "ADMIN") {
return <Navigate to="/admin" replace />;
}

if (user?.role === "VOTER") {
return <Navigate to="/voter" replace />;
}

/**

* Fallback for an unexpected or missing role.
  */
  return <Navigate to="/login" replace />;
  }

export default DashboardRedirect;
