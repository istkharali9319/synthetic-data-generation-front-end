import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <article className="hero-card">
        <span className="pill">404</span>
        <h1>This page is not part of the workspace.</h1>
        <p>The route you asked for does not exist in the SynthIQ React application.</p>
        <div className="hero-actions" style={{ marginTop: 24 }}>
          <Link className="button" to="/">
            Go Home
          </Link>
          <Link className="button-secondary" to="/workspace/dashboard">
            Open Dashboard
          </Link>
        </div>
      </article>
    </main>
  );
}
