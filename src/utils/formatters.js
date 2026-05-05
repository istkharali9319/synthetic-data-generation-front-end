export function formatRowCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value) {
  return `${Number(value).toFixed(2)}%`;
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function buildDatasetName(domain) {
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  return `${domain} Synthetic Dataset ${stamp}`;
}
