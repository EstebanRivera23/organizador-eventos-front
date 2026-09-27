import { NavLink } from "react-router-dom";
import { USE_MOCK } from "../api/client";

function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">OE</div>
          <div>
            <h2>EventFlow</h2>
            <p>Organizador de eventos</p>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/hoy">Hoy</NavLink>
          <NavLink to="/eventos" end>
            Eventos
          </NavLink>
          <NavLink to="/crear">Crear evento</NavLink>
          <NavLink to="/progreso">Progreso</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>

        <div className="sidebar-note">
          <strong>Sprint 1</strong>
          <span>Gestión de eventos y subtareas logísticas.</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel de gestión</p>
            <h1>Organizador de Eventos Independientes</h1>
          </div>

          <div className="topbar-badges">
            {USE_MOCK && (
              <span
                className="mock-badge"
                title="Sin VITE_API_URL: los datos viven en memoria y se pierden al recargar."
              >
                Datos de prueba
              </span>
            )}
            <span className="demo-badge">Usuario demo</span>
          </div>
        </header>

        {children}
      </section>
    </div>
  );
}

export default Layout;
