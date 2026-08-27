import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**

* Protects routes based on the authenticated user's role.
*
* The user must already be authenticated before this
* component is reached.
  */
  function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

/**

* Prevent access when the user's role is not allowed.
  */
  if (!user || !allowedRoles.includes(user.role)) {
  return <Navigate to="/dashboard" replace />;
  }

return <Outlet />;
}

export default RoleRoute;
