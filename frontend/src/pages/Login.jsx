import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

/**
 * Login page for SecureVote users.
 */
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles changes to form fields.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  /**
   * Handles login form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);

      navigate("/dashboard");
    } catch (error) {
        const responseData = error.response?.data;

        const message =
            responseData?.detail ||
            responseData?.username?.[0] ||
            responseData?.password?.[0] ||
            "Unable to sign in. Please check your credentials.";

        setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <section>
        <h1>SecureVote</h1>

        <h2>Sign in</h2>

        <p>Sign in to access your SecureVote account.</p>

        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;