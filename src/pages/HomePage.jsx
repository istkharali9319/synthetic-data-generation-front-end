import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-badge">SI</span>
          <span className="brand-copy">
            <strong>SynthIQ</strong>
            <span>AI synthetic data generator</span>
          </span>
        </Link>

        <div className="hero-actions">
          <Link className="button" to="/login">
            Open Workspace
          </Link>
        </div>
      </header>

      <section className="hero-card">
        <span className="pill">Synthetic Data Suite</span>
        <h1>Generate safe, realistic datasets without exposing production data.</h1>
        <p>
          This React workspace connects directly to your FastAPI backend for login,
          generation previews, dataset management, and compliance reporting.
        </p>
        <div className="hero-actions" style={{ marginTop: 24 }}>
          <Link className="button" to="/login">
            Login Page
          </Link>
          <Link className="button-secondary" to="/workspace/dashboard">
            View Workspace
          </Link>
        </div>
      </section>

      <section className="stats-grid" style={{ marginTop: 22 }}>
        <article className="metric-card">
          <strong>Use Cases</strong>
          <span>Healthcare</span>
          <div className="card-copy">
            Generate privacy-safe patient records and testing datasets.
          </div>
        </article>
        <article className="metric-card">
          <strong>Use Cases</strong>
          <span>Fintech</span>
          <div className="card-copy">
            Create fraud, transaction, and onboarding scenarios for QA teams.
          </div>
        </article>
        <article className="metric-card">
          <strong>Use Cases</strong>
          <span>Retail</span>
          <div className="card-copy">
            Simulate orders, inventory movement, and campaign response data.
          </div>
        </article>
      </section>

      <section className="feature-grid" style={{ marginTop: 22 }}>
        <article className="feature-card">
          <span className="pill">Live Login</span>
          <h2>Authentication</h2>
          <p className="card-copy">
            Uses the FastAPI login endpoint and stores the active workspace session.
          </p>
        </article>
        <article className="feature-card">
          <span className="pill">Live Metrics</span>
          <h2>Dashboard</h2>
          <p className="card-copy">
            Fetches generation volume, privacy score, active jobs, and pipelines.
          </p>
        </article>
        <article className="feature-card">
          <span className="pill">Live Workflows</span>
          <h2>Generator</h2>
          <p className="card-copy">
            Previews schema output, creates jobs, and saves draft datasets.
          </p>
        </article>
      </section>
    </main>
  );
}
