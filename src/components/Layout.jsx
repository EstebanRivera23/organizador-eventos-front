import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { USE_MOCK } from "../api/client";
import logo from "../assets/brand/logo-eventflow.svg";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";
import "../interior.css";

// Marco de todas las pantallas con sesión: barra superior con las pestañas,
// el botón de crear evento y el menú del usuario. En celular las pestañas
// pasan a una barra fija abajo.
function Layout({ children, ocultarCrear = false }) {
  const { organizador, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  const menuRef = useRef(null);
  const botonRef = useRef(null);

  // El menú se cierra con un clic por fuera o con Escape.
  useEffect(() => {
    if (!menuAbierto) return;

    function alHacerClic(e) {
      if (!menuRef.current.contains(e.target)) setMenuAbierto(false);
    }
    function alPresionar(e) {
      if (e.key === "Escape") {
        setMenuAbierto(false);
        botonRef.current.focus();
      }
    }

    document.addEventListener("mousedown", alHacerClic);
    document.addEventListener("keydown", alPresionar);
    return () => {
      document.removeEventListener("mousedown", alHacerClic);
      document.removeEventListener("keydown", alPresionar);
    };
  }, [menuAbierto]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  // El perfil puede no haber cargado (backend caído) aunque haya sesión:
  // igual se permite abrir el menú y cerrar sesión.
  const nombre = organizador?.nombre ?? "Sesión activa";
  const mostrarCrear = !ocultarCrear && pathname !== "/crear";

  return (
    <div className="interior">
      <header className="barra">
        <div className="barra-contenido">
          <Link className="marca" to="/hoy">
            <img src={logo} alt="" width="30" height="30" />
            <span>
              Event<i>Flow</i>
            </span>
          </Link>

          <nav className="pestanas" aria-label="Principal">
            <NavLink to="/hoy">Hoy</NavLink>
            <NavLink to="/eventos">Eventos</NavLink>
            <NavLink to="/progreso">Progreso</NavLink>
          </nav>

          <span className="espacio" />

          {mostrarCrear && (
            <Link className="btn btn-crear" to="/crear">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Crear evento
            </Link>
          )}

          <div className="usuario" ref={menuRef}>
            <button
              type="button"
              className="usuario-boton"
              ref={botonRef}
              aria-haspopup="true"
              aria-expanded={menuAbierto}
              aria-label={`Menú de ${nombre}`}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
            >
              <span className="usuario-inicial" aria-hidden="true">
                {nombre.charAt(0).toUpperCase()}
              </span>
              <span className="usuario-nombre">{nombre}</span>
              <svg
                className="usuario-flecha"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {menuAbierto && (
              <div className="usuario-menu">
                <div className="usuario-quien">
                  <b>{nombre}</b>
                  {organizador?.email && <small>{organizador.email}</small>}
                  {USE_MOCK && (
                    <small
                      className="datos-prueba"
                      title="Los datos viven en memoria y se pierden al recargar."
                    >
                      Modo datos de prueba
                    </small>
                  )}
                </div>
                <Link to="/configuracion" onClick={() => setMenuAbierto(false)}>
                  Configuración
                </Link>
                <button
                  type="button"
                  className="salir"
                  onClick={() => {
                    setMenuAbierto(false);
                    setConfirmandoSalida(true);
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="contenido">{children}</main>

      <nav className="barra-inferior" aria-label="Principal">
        <NavLink to="/hoy">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
          </svg>
          Hoy
        </NavLink>
        <NavLink to="/eventos">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M8 3v4M16 3v4M3 10h18" />
          </svg>
          Eventos
        </NavLink>
        <NavLink to="/crear">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          Crear
        </NavLink>
        <NavLink to="/progreso">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
          </svg>
          Progreso
        </NavLink>
      </nav>

      <ConfirmDialog
        abierto={confirmandoSalida}
        titulo="¿Cerrar sesión?"
        mensaje="Tendrás que volver a ingresar con tu correo y tu contraseña."
        textoConfirmar="Cerrar sesión"
        onConfirmar={handleLogout}
        onCancelar={() => setConfirmandoSalida(false)}
      />
    </div>
  );
}

export default Layout;
