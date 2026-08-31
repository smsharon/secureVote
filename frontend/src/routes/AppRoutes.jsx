import {
BrowserRouter,
Navigate,
Route,
Routes,
} from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import DashboardRedirect from "../pages/DashboardRedirect";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VoterDashboard from "../pages/VoterDashboard";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import Elections from "../pages/Elections";
import ElectionDetails from "../pages/ElectionDetails";
import AdminElections from "../pages/AdminElections";
import AdminPositions from "../pages/AdminPositions";
import AdminCandidates from "../pages/AdminCandidates";
import CandidacyApplication from "../pages/CandidacyApplication";
import AdminCandidateApplications from "../pages/AdminCandidateApplications";

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
          element={<DashboardRedirect />}
        />

        {/* =========================
            VOTER ROUTES
            ========================= */}

        <Route element={<RoleRoute allowedRoles={["VOTER"]} />}>
          <Route
            path="/voter"
            element={<VoterDashboard />}
          />

          <Route
            path="/elections/:id"
            element={<ElectionDetails />}
          />

          <Route
            path="/candidacy"
            element={<CandidacyApplication />}
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

          <Route
            path="/admin/elections"
            element={<AdminElections />}
          />

          <Route
            path="/admin/elections/:id/positions"
            element={<AdminPositions />}
          />

          <Route
            path="/admin/candidates"
            element={<AdminCandidates />}
          />

          <Route
            path="/admin/candidate-applications"
            element={<AdminCandidateApplications />}
          />
        </Route>
        

        {/* Temporary authenticated pages */}
        <Route
          path="/elections"
          element={<Elections />}
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
