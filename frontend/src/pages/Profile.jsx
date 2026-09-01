import { useEffect, useState } from "react";

import apiClient from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiClient.get("/users/me/");

        setProfile(response.data?.data || response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Unable to load your profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <section>
        <h1>My Profile</h1>
        <p>Loading profile...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1>My Profile</h1>
        <p>{error}</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section>
        <h1>My Profile</h1>
        <p>Profile information is unavailable.</p>
      </section>
    );
  }

  const role =
    profile.role === "ADMIN"
      ? "Administrator"
      : "Voter";

  const verificationStatus = profile.is_verified
    ? "Verified"
    : "Not Verified";

  return (
    <section>
      <h1>My Profile</h1>

      <p>
        View and manage your SecureVote account information.
      </p>

      <div>
        <h2>Account Information</h2>

        <p>
          <strong>Username:</strong>{" "}
          {profile.username}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {profile.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {role}
        </p>

        <p>
          <strong>Verification Status:</strong>{" "}
          {verificationStatus}
        </p>
      </div>
    </section>
  );
}

export default Profile;