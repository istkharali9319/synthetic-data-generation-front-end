import { useEffect, useState } from "react";

import { exportDataset, getDatasets } from "../api/synthiq";
import { formatDateTime, formatRowCount } from "../utils/formatters";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState([]);
  const [status, setStatus] = useState("Loading datasets...");

  useEffect(() => {
    loadDatasets();
  }, []);

  async function loadDatasets() {
    try {
      const response = await getDatasets();
      setDatasets(response);
      setStatus("Dataset library synced with the FastAPI backend.");
    } catch (error) {
      setStatus(error.message || "Unable to load datasets.");
    }
  }

  async function handleExport(datasetId) {
    setStatus("Exporting approved dataset...");
    try {
      const response = await exportDataset(datasetId);
      setStatus(response.message);
      await loadDatasets();
    } catch (error) {
      setStatus(error.message || "Unable to export dataset.");
    }
  }

  return (
    <>
      <article className="hero-card">
        <span className="pill">Datasets Page</span>
        <h1>Review generated datasets before teams export them.</h1>
        <p>Track ownership, freshness, fidelity, and approval state for each synthetic dataset in your library.</p>
      </article>

      <article className="table-card">
        <div className="section-heading">
          <h2>Dataset Library</h2>
          <div className="status-text">{status}</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Rows</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Export</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset.id}>
                <td>{dataset.name}</td>
                <td>{dataset.domain}</td>
                <td>{formatRowCount(dataset.row_count)}</td>
                <td>{dataset.owner}</td>
                <td>{dataset.status}</td>
                <td>
                  <div className="table-action-group">
                    <span>{dataset.export_status}</span>
                    {dataset.status === "Approved" && dataset.export_status !== "Exported" ? (
                      <button
                        type="button"
                        className="button-secondary compact-button"
                        onClick={() => handleExport(dataset.id)}
                      >
                        Export
                      </button>
                    ) : null}
                  </div>
                </td>
                <td>{formatDateTime(dataset.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <section className="feature-grid">
        <article className="feature-card">
          <h2>Export Rules</h2>
          <p className="card-copy">Only approved datasets can be exported. The button is enabled only for those records.</p>
        </article>
        <article className="feature-card">
          <h2>Retention Window</h2>
          <p className="card-copy">Draft datasets remain blocked for export until they pass review and approval.</p>
        </article>
        <article className="feature-card">
          <h2>Lineage</h2>
          <p className="card-copy">Every dataset is generated and tracked through the same FastAPI-backed workflow.</p>
        </article>
      </section>
    </>
  );
}
