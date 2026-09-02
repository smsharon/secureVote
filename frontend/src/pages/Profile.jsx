import { useEffect, useState } from "react";

import apiClient from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiClient.get("/users/me/");

        const data = response.data?.data || response.data;

        setProfile(data);

        setFormData({
          username: data.username || "",
          email: data.email || "",
        });
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await apiClient.patch(
        "/users/me/",
        formData,
      );

      const updatedProfile =
        response.data?.data || response.data;

      setProfile(updatedProfile);

      setFormData({
        username: updatedProfile.username || "",
        email: updatedProfile.email || "",
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      const responseData = err.response?.data;

      if (typeof responseData === "object") {
        const messages = Object.entries(responseData)
          .flatMap(([field, value]) => {
            const errors = Array.isArray(value)
              ? value
              : [value];

            return errors.map(
              (message) => `${field}: ${message}`,
            );
          });

        setError(
          messages.join(" ") ||
            "Unable to update your profile.",
        );
      } else {
        setError("Unable to update your profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section>
        <h1>My Profile</h1>
        <p>Loading profile...</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section>
        <h1>My Profile</h1>
        <p>{error || "Profile information unavailable."}</p>
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
        View and update your SecureVote account information.
      </p>

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      <div>
        <h2>Account Information</h2>

        <p>
          <strong>Role:</strong> {role}
        </p>

        <p>
          <strong>Verification Status:</strong>{" "}
          {verificationStatus}
        </p>

        <p>
          <strong>Member Since:</strong>{" "}
          {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>

        <div>
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default Profile;