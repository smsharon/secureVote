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
    You can view elections and participate in
    eligible voting activities.
  </p>
</section>


);
}

export default VoterDashboard;
