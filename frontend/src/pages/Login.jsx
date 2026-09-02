import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import "./Login.css";

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
    <main className="auth-page">
      <div className="auth-atmosphere" aria-hidden="true">
        <span className="atmosphere-line atmosphere-line-one" />
        <span className="atmosphere-line atmosphere-line-two" />
        <span className="atmosphere-mark">01</span>
      </div>

      <section className="login-shell">
        <div className="login-aside">
          <div className="login-mark">
            <span />
            SecureVote
          </div>

          <div className="login-introduction">
            <p className="auth-eyebrow">PRIVATE VOTING PLATFORM</p>

            <h1>
              Your vote.
              <br />
              Your voice.
            </h1>

            <p className="login-intro-text">
              A secure space for participating in elections with confidence,
              clarity, and accountability.
            </p>
          </div>

          <div className="login-aside-footer">
            <span>SECUREVOTE</span>
            <span>EST. 2026</span>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-panel-heading">
            <p className="auth-eyebrow">ACCOUNT ACCESS</p>

            <h2>Sign in</h2>

            <p>
              Enter your credentials to continue to your account.
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span className="auth-error-mark">!</span>
              <span>{error}</span>
            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              className="login-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting ? "Authenticating" : "Continue"}
              </span>

              {!isSubmitting && (
                <span className="login-arrow" aria-hidden="true">
                  →
                </span>
              )}

              {isSubmitting && (
                <span
                  className="login-loader"
                  aria-hidden="true"
                />
              )}
            </button>
          </form>

          <div className="login-divider">
            <span />
            <small>NEW TO SECUREVOTE?</small>
            <span />
          </div>

          <Link
            className="register-link"
            to="/register"
          >
            <span>Create an account</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <p className="login-security-note">
            Your account access is protected by secure authentication.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;