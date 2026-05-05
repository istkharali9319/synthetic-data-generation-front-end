import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    to: "/workspace/dashboard",
    title: "Dashboard",
    description: "Volume, privacy, jobs, health",
  },
  {
    to: "/workspace/generator",
    title: "Generator",
    description: "Dataset setup and preview",
  },
  {
    to: "/workspace/datasets",
    title: "Datasets",
    description: "Library and export actions",
  },
  {
    to: "/workspace/reports",
    title: "Reports",
    description: "Quality and audit reviews",
  },
];

export default function WorkspaceLayout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="page-shell">
      <div className="shell-grid">
        <aside className="sidebar">
          <NavLink className="brand" to="/">
            <span className="brand-badge">SI</span>
            <span className="brand-copy">
              <strong>SynthIQ</strong>
              <span>Synthetic data workspace</span>
            </span>
          </NavLink>

          <nav className="nav-group">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                <strong>{item.title}</strong>
                <span className="subtle">{item.description}</span>
              </NavLink>
            ))}
          </nav>

          <div className="status-box">
            <strong className="section-title">Signed In</strong>
            <div className="subtle">
              {auth?.full_name} · {auth?.role}
            </div>
            <div className="subtle">{auth?.email}</div>
          </div>

          <button type="button" className="button-secondary full-width" onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <section className="main-stack">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
