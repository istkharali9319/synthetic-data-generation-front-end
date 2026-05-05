import { useEffect, useState } from "react";

import { getReportsSummary, getReviewQueue } from "../api/synthiq";
import { ErrorBlock, LoadingBlock } from "../components/AsyncState";
import { formatPercent } from "../utils/formatters";

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadReports() {
      try {
        const [summaryResponse, reviewQueueResponse] = await Promise.all([
          getReportsSummary(),
          getReviewQueue(),
        ]);

        if (!ignore) {
          setSummary(summaryResponse);
          setReviewQueue(reviewQueueResponse);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to load reports.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadReports();
    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <LoadingBlock message="Loading reports and review queue..." />;
  }

  if (error) {
    return <ErrorBlock message={error} />;
  }

  return (
    <>
      <article className="hero-card">
        <span className="pill">Reports Page</span>
        <h1>Turn generation activity into audit-ready evidence.</h1>
        <p>Use this page to present privacy, fidelity, fairness, and release decisions for synthetic data programs.</p>
      </article>

      <section className="metrics-grid">
        <article className="metric-card">
          <strong>Privacy Compliance</strong>
          <span>{formatPercent(summary.privacy_compliance)}</span>
          <div className="card-copy">Latest datasets met internal privacy thresholds.</div>
        </article>
        <article className="metric-card">
          <strong>Bias Alerts</strong>
          <span>{String(summary.bias_alerts).padStart(2, "0")}</span>
          <div className="card-copy">Open risk signals across the review queue.</div>
        </article>
        <article className="metric-card">
          <strong>Audit Packages</strong>
          <span>{summary.audit_packages}</span>
          <div className="card-copy">Approved report packages available for audit sharing.</div>
        </article>
        <article className="metric-card">
          <strong>Model Drift</strong>
          <span>{summary.model_drift}</span>
          <div className="card-copy">Current drift status from recent report summaries.</div>
        </article>
      </section>

      <section className="split-panel">
        <article className="panel stack">
          <div className="info-strip">
            <strong className="section-title">Latest Report Highlights</strong>
            <div className="subtle">These points are loaded live from the reports summary API.</div>
          </div>
          {summary.highlights.map((highlight) => (
            <div key={highlight} className="mini-card">
              <strong>Highlight</strong>
              <div className="card-copy">{highlight}</div>
            </div>
          ))}
        </article>

        <article className="panel">
          <h2>Review Queue</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Reviewer</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reviewQueue.map((item) => (
                <tr key={`${item.report}-${item.reviewer}`}>
                  <td>{item.report}</td>
                  <td>{item.reviewer}</td>
                  <td>{item.priority}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </>
  );
}
