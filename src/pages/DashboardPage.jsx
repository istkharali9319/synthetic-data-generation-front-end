import { useEffect, useState } from "react";

import { getDashboardPipelines, getDashboardSummary } from "../api/synthiq";
import { ErrorBlock, LoadingBlock } from "../components/AsyncState";
import { formatPercent } from "../utils/formatters";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [pipelines, setPipelines] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        const [summaryResponse, pipelinesResponse] = await Promise.all([
          getDashboardSummary(),
          getDashboardPipelines(),
        ]);

        if (!ignore) {
          setSummary(summaryResponse);
          setPipelines(pipelinesResponse);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to load dashboard.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <LoadingBlock message="Loading dashboard metrics..." />;
  }

  if (error) {
    return <ErrorBlock message={error} />;
  }

  return (
    <>
      <article className="hero-card">
        <span className="pill">Dashboard</span>
        <h1>Monitor synthetic data operations in one place.</h1>
        <p>Track generation throughput, privacy confidence, schema fidelity, and review queues across teams.</p>
      </article>

      <section className="metrics-grid">
        <article className="metric-card">
          <strong>Datasets Generated</strong>
          <span>{summary.datasets_generated}</span>
          <div className="card-copy">Live count from the datasets table.</div>
        </article>
        <article className="metric-card">
          <strong>Privacy Score</strong>
          <span>{formatPercent(summary.privacy_score)}</span>
          <div className="card-copy">Average privacy score across current datasets.</div>
        </article>
        <article className="metric-card">
          <strong>Active Jobs</strong>
          <span>{String(summary.active_jobs).padStart(2, "0")}</span>
          <div className="card-copy">Running, queued, and review-stage generation jobs.</div>
        </article>
        <article className="metric-card">
          <strong>Average Fidelity</strong>
          <span>{formatPercent(summary.average_fidelity)}</span>
          <div className="card-copy">Average schema fidelity from saved datasets.</div>
        </article>
      </section>

      <section className="split-panel">
        <article className="panel">
          <h2>Pipeline Snapshot</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Pipeline</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((pipeline) => (
                <tr key={pipeline.id}>
                  <td>{pipeline.pipeline}</td>
                  <td>{pipeline.owner}</td>
                  <td>{pipeline.status}</td>
                  <td>{pipeline.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel stack">
          <div className="info-strip">
            <strong className="section-title">Workspace Status</strong>
            <div className="subtle">{summary.workspace_status}</div>
          </div>
          <div className="mini-card">
            <strong>Recommended Next Step</strong>
            <div className="card-copy">{summary.recommended_next_step}</div>
          </div>
          <div className="mini-card">
            <strong>Live Backend</strong>
            <div className="card-copy">
              These metrics are now coming from PostgreSQL through the FastAPI service.
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
