import { useAuth } from "../hooks/useAuth";

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
</section>


);
}

export default AdminDashboard;
