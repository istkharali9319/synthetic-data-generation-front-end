import { useEffect, useState } from "react";

import {
  createDataset,
  createGeneratorJob,
  getGeneratorJobs,
  getGeneratorPreview,
} from "../api/synthiq";
import { useAuth } from "../context/AuthContext";
import { buildDatasetName, formatDateTime, formatRowCount } from "../utils/formatters";

const defaultForm = {
  domain: "Fintech",
  target_rows: 500000,
  privacy_level: "High",
  output_format: "CSV",
  schema_fields:
    "customer_id, transaction_date, merchant_category, amount, risk_flag, review_outcome",
  prompt:
    "Generate a fintech transaction dataset with realistic purchase patterns, seasonal spikes, suspicious activity flags, and a balanced mix of approved and reviewed transactions.",
};

const healthcareSample = {
  domain: "Healthcare",
  target_rows: 250000,
  privacy_level: "Balanced",
  output_format: "Parquet",
  schema_fields:
    "patient_id, visit_date, diagnosis_code, treatment_cost, admission_type, recovery_days",
  prompt:
    "Generate a hospital admissions dataset with emergency and scheduled visits, realistic treatment costs, and recovery duration patterns by diagnosis group.",
};

export default function GeneratorPage() {
  const { auth } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [preview, setPreview] = useState("No preview generated yet.");
  const [qualityNotes, setQualityNotes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("Ready to generate.");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response = await getGeneratorJobs();
      setJobs(response);
    } catch (error) {
      setStatus(error.message || "Unable to load generator jobs.");
    }
  }

  function updateField(event) {
    const { id, value } = event.target;
    setForm((current) => ({
      ...current,
      [id]: id === "target_rows" ? Number(value) : value,
    }));
  }

  async function handlePreview(event) {
    event.preventDefault();
    setIsPreviewLoading(true);
    setStatus("Generating preview...");

    try {
      const response = await getGeneratorPreview(form);
      setPreview(response.preview);
      setQualityNotes(response.quality_notes);
      setStatus("Preview ready.");
    } catch (error) {
      setStatus(error.message || "Unable to generate preview.");
    } finally {
      setIsPreviewLoading(false);
    }
  }

  async function handleCreateJob() {
    setIsSaving(true);
    setStatus("Creating generation job...");

    try {
      const jobPayload = {
        ...form,
        requested_by_id: auth.user_id,
      };
      await createGeneratorJob(jobPayload);

      await createDataset({
        name: buildDatasetName(form.domain),
        domain: form.domain,
        row_count: form.target_rows,
        owner_id: auth.user_id,
        status: "Draft",
        output_format: form.output_format,
        fidelity_score: 94.1,
        privacy_score: form.privacy_level === "High" ? 98.6 : 95.2,
        lineage_note: `Generated from prompt: ${form.prompt}`,
      });

      setStatus("Generation job created and draft dataset saved.");
      await loadJobs();
    } catch (error) {
      setStatus(error.message || "Unable to create generation job.");
    } finally {
      setIsSaving(false);
    }
  }

  function loadHealthcareSample() {
    setForm(healthcareSample);
    setStatus("Healthcare sample loaded.");
  }

  return (
    <>
      <article className="hero-card">
        <span className="pill">Generator Page</span>
        <h1>Design realistic synthetic datasets with guided controls.</h1>
        <p>Use this page to describe the dataset, tune privacy intensity, and preview the generated sample output.</p>
      </article>

      <section className="split-panel">
        <article className="panel">
          <form className="field-grid" onSubmit={handlePreview}>
            <div className="field-row">
              <div>
                <label htmlFor="domain">Industry Domain</label>
                <select id="domain" value={form.domain} onChange={updateField}>
                  <option>Healthcare</option>
                  <option>Fintech</option>
                  <option>Retail</option>
                  <option>EdTech</option>
                </select>
              </div>
              <div>
                <label htmlFor="target_rows">Target Rows</label>
                <input id="target_rows" type="number" min="1" value={form.target_rows} onChange={updateField} />
              </div>
            </div>

            <div className="field-row">
              <div>
                <label htmlFor="privacy_level">Privacy Level</label>
                <select id="privacy_level" value={form.privacy_level} onChange={updateField}>
                  <option>High</option>
                  <option>Balanced</option>
                  <option>Exploratory</option>
                </select>
              </div>
              <div>
                <label htmlFor="output_format">Output Format</label>
                <select id="output_format" value={form.output_format} onChange={updateField}>
                  <option>CSV</option>
                  <option>JSON</option>
                  <option>Parquet</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="schema_fields">Schema Fields</label>
              <textarea id="schema_fields" value={form.schema_fields} onChange={updateField} />
            </div>

            <div>
              <label htmlFor="prompt">Generation Prompt</label>
              <textarea id="prompt" value={form.prompt} onChange={updateField} />
            </div>

            <div className="form-actions">
              <button className="button" type="submit" disabled={isPreviewLoading}>
                {isPreviewLoading ? "Generating..." : "Generate Preview"}
              </button>
              <button className="button-secondary" type="button" onClick={loadHealthcareSample}>
                Load Another Sample
              </button>
              <button className="button-ghost" type="button" onClick={handleCreateJob} disabled={isSaving}>
                {isSaving ? "Saving..." : "Create Job & Save Dataset"}
              </button>
            </div>

            <div className="status-text">{status}</div>
          </form>
        </article>

        <article className="preview-box">
          <span className="pill">Sample Output</span>
          <pre id="previewText">{preview}</pre>
          {qualityNotes.length > 0 ? (
            <div className="preview-notes">
              <strong className="section-title">Quality Notes</strong>
              <ul className="info-list">
                {qualityNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </section>

      <article className="table-card">
        <h2>Recent Generation Jobs</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Domain</th>
              <th>Rows</th>
              <th>Format</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.domain}</td>
                <td>{formatRowCount(job.target_rows)}</td>
                <td>{job.output_format}</td>
                <td>{job.status}</td>
                <td>{formatDateTime(job.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </>
  );
}
