import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import "./AppLayout.css";

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  function getNavLinkClass({ isActive }) {
    return isActive ? "shell-nav-link active" : "shell-nav-link";
  }

  function getPageLabel() {
    if (location.pathname.startsWith("/profile")) {
      return "Profile";
    }

    if (location.pathname.startsWith("/my-votes")) {
      return "My Votes";
    }

    if (location.pathname.startsWith("/elections")) {
      return "Elections";
    }

    if (location.pathname.startsWith("/admin")) {
      return "Administration";
    }

    return "Dashboard";
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <NavLink to="/dashboard" aria-label="SecureVote dashboard">
              <span className="brand-symbol" aria-hidden="true" />
              <span>SecureVote</span>
            </NavLink>
          </div>

          <div className="shell-page-indicator">
            <span>SECUREVOTE</span>
            <strong>/</strong>
            <span>{getPageLabel()}</span>
          </div>

          <nav
            className="app-nav"
            aria-label="Main navigation"
          >
            <NavLink
              to="/dashboard"
              className={getNavLinkClass}
              end
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/elections"
              className={getNavLinkClass}
            >
              Elections
            </NavLink>

            <NavLink
              to="/my-votes"
              className={getNavLinkClass}
            >
              My Votes
            </NavLink>

            <NavLink
              to="/profile"
              className={getNavLinkClass}
            >
              Profile
            </NavLink>
          </nav>

          <div className="app-user">
            <div className="user-identity">
              <span className="user-status" aria-hidden="true" />
              <div>
                <strong>{user?.username}</strong>
                <small>
                  {user?.role === "ADMIN" ? "Administrator" : "Voter"}
                </small>
              </div>
            </div>

            <button
              className="shell-logout"
              type="button"
              onClick={logout}
            >
              <span>Sign out</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <div className="mobile-shell-context">
          <span>{getPageLabel()}</span>
          <span>SECURE SESSION</span>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div>
          <span className="footer-symbol" aria-hidden="true" />
          <span>SecureVote</span>
        </div>

        <span>PRIVATE VOTING PLATFORM</span>

        <span>2026</span>
      </footer>
    </div>
  );
}

export default AppLayout;