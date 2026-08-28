import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**

* Dashboard displayed to SecureVote voters.
  */
  function VoterDashboard() {
  const { user } = useAuth();

return ( <section> <h1>Voter Dashboard</h1>


  <p>
    Welcome, {user?.username}.
  </p>

  <p>
    View available elections and participate in
    eligible voting activities.
  </p>

  <div>
    <Link to="/elections">
      View Elections
    </Link>
  </div>

  <div>
    <Link to="/my-votes">
      My Votes
    </Link>
  </div>

  <div>
    <Link to="/profile">
      My Profile
    </Link>
  </div>
</section>


);
}

export default VoterDashboard;
