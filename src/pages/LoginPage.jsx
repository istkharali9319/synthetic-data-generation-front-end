import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "analyst@synthiq.ai",
  password: "Password@123",
  role: "Analyst",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("Use the seeded demo account or your own API-backed user.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Signing in...");

    try {
      await login(form);
      setStatus("Login successful. Opening dashboard...");
      navigate(location.state?.from || "/workspace/dashboard");
    } catch (error) {
      setStatus(error.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(event) {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
  }

  return (
    <main className="login-wrap">
      <section className="login-card">
        <div className="login-side">
          <span className="pill">Login Page</span>
          <h1>Access your synthetic data control room.</h1>
          <p>
            Sign in to launch generation pipelines, manage datasets, and review privacy
            reports from one workspace.
          </p>

          <div className="badge-grid">
            <article className="mini-card">
              <strong>Fast Setup</strong>
              <div className="card-copy">Demo credentials are prefilled for quick testing.</div>
            </article>
            <article className="mini-card">
              <strong>Role Visibility</strong>
              <div className="card-copy">Role selection is validated against the backend user role.</div>
            </article>
            <article className="mini-card">
              <strong>API Ready</strong>
              <div className="card-copy">This page now authenticates against FastAPI instead of static HTML.</div>
            </article>
            <article className="mini-card">
              <strong>Shared Workspace</strong>
              <div className="card-copy">One login unlocks dashboard, generator, datasets, and reports.</div>
            </article>
          </div>

          <div className="alert-card">
            <strong className="section-title">Seeded Demo Account</strong>
            <ul className="info-list">
              <li>Email: analyst@synthiq.ai</li>
              <li>Password: Password@123</li>
              <li>Role: Analyst</li>
            </ul>
          </div>
        </div>

        <div className="panel">
          <Link className="brand" to="/">
            <span className="brand-badge">SI</span>
            <span className="brand-copy">
              <strong>SynthIQ</strong>
              <span>AI synthetic data generator</span>
            </span>
          </Link>

          <form className="field-grid" style={{ marginTop: 24 }} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Work Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={form.email}
                onChange={updateField}
              />
            </div>

            <div className="field-row">
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={updateField}
                />
              </div>
              <div>
                <label htmlFor="role">Role</label>
                <select id="role" value={form.role} onChange={updateField}>
                  <option>Analyst</option>
                  <option>ML Engineer</option>
                  <option>Compliance Reviewer</option>
                </select>
              </div>
            </div>

            <div className="info-strip">
              <strong className="section-title">Workspace Access</strong>
              <div className="field-note">
                Successful login stores your API session locally and redirects into the live dashboard.
              </div>
            </div>

            <div className="form-actions">
              <button className="button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Login to Dashboard"}
              </button>
              <Link className="button-secondary" to="/">
                Back
              </Link>
            </div>

            <div className={`status-text${status.toLowerCase().includes("unable") ? " error-text" : ""}`}>
              {status}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
