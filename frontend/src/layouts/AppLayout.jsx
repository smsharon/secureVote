import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**

* Shared layout for authenticated SecureVote users.
*
* Provides:
* * Application header
* * Authenticated user information
* * Main navigation
* * Logout action
* * Outlet for protected pages
    */
    function AppLayout() {
    const { user, logout } = useAuth();

/**

* Adds an active class to the currently selected navigation link.
  */
  function getNavLinkClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
  }

return ( <div className="app-layout"> <header className="app-header"> <div className="app-brand"> <NavLink to="/dashboard">
SecureVote </NavLink> </div>


    <nav aria-label="Main navigation">
      <NavLink
        to="/dashboard"
        className={getNavLinkClass}
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
      <span>
        {user?.username}
      </span>

      <button
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  </header>

  <main className="app-content">
    <Outlet />
  </main>
</div>


);
}

export default AppLayout;
