import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

/**

* Dashboard displayed to SecureVote administrators.
  */
  function AdminDashboard() {
  const { user } = useAuth();

return ( <section> <h1>Admin Dashboard</h1>


  <p>
    Welcome, {user?.username}.
  </p>

  <p>
    You have administrator access to SecureVote.
  </p>

  <div>
    <Link to="/admin/elections">
      Manage Elections
    </Link>

    <Link to="/admin/candidate-applications">
      Candidate Applications
    </Link>

    <Link to="/admin/voters">
      Manage Voters
    </Link>
  </div>
</section>


);
}

export default AdminDashboard;
