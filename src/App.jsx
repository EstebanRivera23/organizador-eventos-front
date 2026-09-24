import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

const todayTasks = [
  {
    id: 1,
    event: "Boda de Ana y Luis",
    task: "Confirmar catering",
    date: "Hoy",
    hours: 2,
    priority: "Alta",
    status: "Pendiente",
  },
  {
    id: 2,
    event: "Cumpleaños de Laura",
    task: "Llamar proveedor de sonido",
    date: "Hoy",
    hours: 1,
    priority: "Media",
    status: "En revisión",
  },
  {
    id: 3,
    event: "Evento empresarial",
    task: "Verificar disponibilidad del salón",
    date: "Hoy",
    hours: 3,
    priority: "Alta",
    status: "Pendiente",
  },
];

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
          <NavLink to="/crear">Crear evento</NavLink>
          <NavLink to="/evento/1">Detalle evento</NavLink>
          <NavLink to="/progreso">Progreso</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>

        <div className="sidebar-note">
          <strong>Sprint 0</strong>
          <span>Prototipo inicial y rutas base.</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel de gestión</p>
            <h1>Organizador de Eventos Independientes</h1>
          </div>

          <span className="demo-badge">Usuario demo</span>
        </header>

        {children}
      </section>
    </div>
  );
}

function Hoy() {
  return (
    <Layout>
      <section className="hero-card">
        <div>
          <p className="eyebrow">Vista Hoy</p>
          <h2>Gestiones urgentes del día</h2>
          <p>
            Aquí se priorizan las tareas que requieren atención inmediata para
            evitar retrasos en la preparación de los eventos.
          </p>
        </div>

        <div className="hero-number">
          <span>{todayTasks.length}</span>
          <p>Tareas activas</p>
        </div>
      </section>

      <section className="stats-grid">
        <article>
          <span>Eventos activos</span>
          <strong>3</strong>
        </article>

        <article>
          <span>Horas estimadas hoy</span>
          <strong>6h</strong>
        </article>

        <article>
          <span>Prioridad alta</span>
          <strong>2</strong>
        </article>
      </section>

      <section className="task-board">
        {todayTasks.map((item) => (
          <article className="event-card" key={item.id}>
            <div className="card-header">
              <span className={`priority ${item.priority.toLowerCase()}`}>
                {item.priority}
              </span>
              <span className="status">{item.status}</span>
            </div>

            <h3>{item.task}</h3>
            <p>{item.event}</p>

            <div className="card-footer">
              <span>{item.date}</span>
              <span>{item.hours} horas</span>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}

function Crear() {
  return (
    <Layout>
      <section className="content-card">
        <p className="eyebrow">Nuevo evento</p>
        <h2>Crear evento</h2>
        <p>
          Pantalla base para registrar un evento. Esta funcionalidad se
          completará en el Sprint 1.
        </p>

        <form className="form-grid">
          <label>
            Nombre del evento
            <input type="text" placeholder="Ejemplo: Boda de Ana y Luis" />
          </label>

          <label>
            Fecha del evento
            <input type="date" />
          </label>

          <label>
            Horas máximas por día
            <input type="number" placeholder="Ejemplo: 6" />
          </label>

          <label>
            Tipo de evento
            <select>
              <option>Boda</option>
              <option>Cumpleaños</option>
              <option>Evento empresarial</option>
              <option>Otro</option>
            </select>
          </label>

          <button type="button">Guardar evento demo</button>
        </form>
      </section>
    </Layout>
  );
}

function EventoDetalle() {
  return (
    <Layout>
      <section className="content-card">
        <p className="eyebrow">Detalle</p>
        <h2>Boda de Ana y Luis</h2>
        <p>
          Pantalla base para visualizar las tareas principales del evento
          seleccionado.
        </p>

        <div className="timeline">
          <div>
            <strong>Reservar salón</strong>
            <span>Pendiente</span>
          </div>

          <div>
            <strong>Enviar invitaciones</strong>
            <span>En proceso</span>
          </div>

          <div>
            <strong>Confirmar catering</strong>
            <span>Urgente</span>
          </div>

          <div>
            <strong>Coordinar proveedores</strong>
            <span>Pendiente</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Progreso() {
  return (
    <Layout>
      <section className="content-card">
        <p className="eyebrow">Seguimiento</p>
        <h2>Progreso del evento</h2>
        <p>
          Barra inicial para visualizar el avance de preparación del evento.
        </p>

        <div className="progress-wrapper">
          <div className="progress-info">
            <span>Preparación general</span>
            <strong>25%</strong>
          </div>

          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>
        </div>

        <p className="progress-note">1 de 4 tareas completadas.</p>
      </section>
    </Layout>
  );
}

function Login() {
  return (
    <Layout>
      <section className="login-card">
        <p className="eyebrow">Acceso</p>
        <h2>Iniciar sesión</h2>
        <p>
          Pantalla base de autenticación. Esta funcionalidad se completará en el
          Sprint 2.
        </p>

        <form className="form-grid">
          <label>
            Correo electrónico
            <input type="email" placeholder="usuario@correo.com" />
          </label>

          <label>
            Contraseña
            <input type="password" placeholder="********" />
          </label>

          <button type="button">Ingresar demo</button>
        </form>
      </section>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hoy />} />
        <Route path="/hoy" element={<Hoy />} />
        <Route path="/crear" element={<Crear />} />
        <Route path="/evento/:id" element={<EventoDetalle />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;