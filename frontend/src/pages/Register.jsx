import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import "./Register.css";

/**
 * Registration page for new SecureVote voters.
 */
function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
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
   * Handles registration form submission.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await register(formData);

      navigate("/login");
    } catch (error) {
      const responseData = error.response?.data;

      const message =
        responseData?.detail ||
        responseData?.username?.[0] ||
        responseData?.email?.[0] ||
        responseData?.password?.[0] ||
        responseData?.password_confirm?.[0] ||
        "Unable to create your account. Please check your information.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page register-page">
      <div className="auth-atmosphere" aria-hidden="true">
        <span className="atmosphere-line atmosphere-line-one" />
        <span className="atmosphere-line atmosphere-line-two" />
        <span className="atmosphere-mark">02</span>
      </div>

      <section className="register-shell">
        <div className="register-aside">
          <div className="register-mark">
            <span />
            SecureVote
          </div>

          <div className="register-introduction">
            <p className="auth-eyebrow">JOIN SECUREVOTE</p>

            <h1>
              Take part.
              <br />
              Be counted.
            </h1>

            <p className="register-intro-text">
              Create your account to participate in secure, transparent
              elections and keep a record of your civic participation.
            </p>
          </div>

          <div className="register-aside-footer">
            <span>PRIVATE • SECURE • ACCOUNTABLE</span>
            <span>02 / 03</span>
          </div>
        </div>

        <div className="register-panel">
          <div className="register-panel-heading">
            <p className="auth-eyebrow">ACCOUNT REGISTRATION</p>

            <h2>Create account</h2>

            <p>
              Set up your SecureVote account. Your account details will be
              used to identify you during participation.
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span className="auth-error-mark">!</span>
              <span>{error}</span>
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-form-row">
              <div className="auth-field">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="register-form-row">
              <div className="auth-field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password_confirm">
                  Confirm password
                </label>

                <input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            </div>

            <button
              className="register-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting
                  ? "Creating account"
                  : "Create account"}
              </span>

              {!isSubmitting && (
                <span
                  className="register-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              )}

              {isSubmitting && (
                <span
                  className="register-loader"
                  aria-hidden="true"
                />
              )}
            </button>
          </form>

          <div className="register-divider">
            <span />
            <small>ALREADY REGISTERED?</small>
            <span />
          </div>

          <Link
            className="login-link"
            to="/login"
          >
            <span>Return to sign in</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <p className="register-security-note">
            By creating an account, you agree to use SecureVote only for
            legitimate election participation.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;