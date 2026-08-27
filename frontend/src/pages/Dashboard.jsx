import { useAuth } from "../hooks/useAuth";

/**

* Dashboard for authenticated SecureVote users.
  */
  function Dashboard() {
  const { user, logout } = useAuth();

return ( <main> <h1>SecureVote Dashboard</h1>


  <p>
    Welcome, {user?.username}.
  </p>

  <p>
    You are successfully authenticated.
  </p>

  <button type="button" onClick={logout}>
    Logout
  </button>
</main>


);
}

export default Dashboard;
