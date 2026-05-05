export function LoadingBlock({ message = "Loading..." }) {
  return (
    <article className="panel">
      <div className="status-text">{message}</div>
    </article>
  );
}

export function ErrorBlock({ message }) {
  return (
    <article className="panel">
      <div className="status-text error-text">{message}</div>
    </article>
  );
}
