import {
BrowserRouter,
Navigate,
Route,
Routes,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
return ( <BrowserRouter> <Routes>
{/* Public routes */}
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />


    {/* Protected application */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/elections"
          element={
            <div>
              <h1>Elections</h1>
              <p>Election management will be available here.</p>
            </div>
          }
        />

        <Route
          path="/my-votes"
          element={
            <div>
              <h1>My Votes</h1>
              <p>Your voting history will appear here.</p>
            </div>
          }
        />

        <Route
          path="/profile"
          element={
            <div>
              <h1>Profile</h1>
              <p>Your account information will appear here.</p>
            </div>
          }
        />
      </Route>
    </Route>

    {/* Default route */}
    <Route
      path="*"
      element={<Navigate to="/dashboard" replace />}
    />
  </Routes>
</BrowserRouter>


);
}

export default AppRoutes;
