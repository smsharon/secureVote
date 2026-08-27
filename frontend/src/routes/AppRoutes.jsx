import {
BrowserRouter,
Navigate,
Route,
Routes,
} from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VoterDashboard from "../pages/VoterDashboard";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
return ( <BrowserRouter> <Routes>
{/* =========================
PUBLIC ROUTES
========================= */}


    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    {/* =========================
        AUTHENTICATED ROUTES
        ========================= */}

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        {/* General authenticated dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* =========================
            VOTER ROUTES
            ========================= */}

        <Route element={<RoleRoute allowedRoles={["VOTER"]} />}>
          <Route
            path="/voter"
            element={<VoterDashboard />}
          />
        </Route>

        {/* =========================
            ADMIN ROUTES
            ========================= */}

        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
        </Route>

        {/* Temporary authenticated pages */}
        <Route
          path="/elections"
          element={
            <div>
              <h1>Elections</h1>
              <p>
                Election management will be available here.
              </p>
            </div>
          }
        />

        <Route
          path="/my-votes"
          element={
            <div>
              <h1>My Votes</h1>
              <p>
                Your voting history will appear here.
              </p>
            </div>
          }
        />

        <Route
          path="/profile"
          element={
            <div>
              <h1>Profile</h1>
              <p>
                Your account information will appear here.
              </p>
            </div>
          }
        />
      </Route>
    </Route>

    {/* =========================
        FALLBACK
        ========================= */}

    <Route
      path="*"
      element={
        <Navigate
          to="/dashboard"
          replace
        />
      }
    />
  </Routes>
</BrowserRouter>


);
}

export default AppRoutes;
