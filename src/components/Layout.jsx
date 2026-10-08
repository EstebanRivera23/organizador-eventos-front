import { NavLink, useNavigate } from "react-router-dom";
import { USE_MOCK } from "../api/client";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {
  const { organizador, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

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
          <NavLink to="/configuracion">Configuración</NavLink>
        </nav>
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

            {/* El perfil puede no haber cargado (backend caído) aunque
                haya sesión: igual se permite cerrar sesión. */}
            <span className="demo-badge">
              {organizador?.nombre ?? "Sesión activa"}
            </span>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        {children}
      </section>
    </div>
  );
}

export default Layout;
