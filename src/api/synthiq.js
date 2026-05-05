import { apiRequest } from "./client";

export function login(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getDashboardSummary() {
  return apiRequest("/dashboard/summary");
}

export function getDashboardPipelines() {
  return apiRequest("/dashboard/pipelines");
}

export function getGeneratorJobs() {
  return apiRequest("/generator/jobs");
}

export function getGeneratorPreview(payload) {
  return apiRequest("/generator/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createGeneratorJob(payload) {
  return apiRequest("/generator/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getDatasets() {
  return apiRequest("/datasets");
}

export function createDataset(payload) {
  return apiRequest("/datasets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function exportDataset(datasetId) {
  return apiRequest(`/datasets/${datasetId}/export`, {
    method: "POST",
  });
}

export function getReportsSummary() {
  return apiRequest("/reports/summary");
}

export function getReviewQueue() {
  return apiRequest("/reports/review-queue");
}
