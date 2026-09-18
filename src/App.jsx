import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function Hoy() {
  const tareasUrgentes = [
    {
      id: 1,
      evento: "Boda de Ana y Luis",
      tarea: "Confirmar catering",
      fecha: "Hoy",
      horas: 2,
      prioridad: "Alta",
    },
    {
      id: 2,
      evento: "Cumpleaños de Laura",
      tarea: "Llamar proveedor de sonido",
      fecha: "Hoy",
      horas: 1,
      prioridad: "Media",
    },
    {
      id: 3,
      evento: "Evento empresarial",
      tarea: "Verificar disponibilidad del salón",
      fecha: "Hoy",
      horas: 3,
      prioridad: "Alta",
    },
  ];

  return (
    <main className="container">
      <h1>Vista Hoy</h1>
      <p className="description">
        Aquí aparecen las gestiones urgentes del día para los eventos independientes.
      </p>

      {tareasUrgentes.length === 0 ? (
        <section className="empty-state">
          <h2>No tienes tareas urgentes para hoy</h2>
          <p>Cuando existan tareas próximas a vencer, aparecerán en esta sección.</p>
        </section>
      ) : (
        <section className="task-list">
          {tareasUrgentes.map((item) => (
            <article className="task-card" key={item.id}>
              <span className={`priority ${item.prioridad.toLowerCase()}`}>
                Prioridad {item.prioridad}
              </span>

              <h2>{item.tarea}</h2>

              <p>
                <strong>Evento:</strong> {item.evento}
              </p>

              <p>
                <strong>Fecha límite:</strong> {item.fecha}
              </p>

              <p>
                <strong>Horas estimadas:</strong> {item.horas}h
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function Crear() {
  return (
    <main className="container">
      <h1>Crear evento</h1>
      <p className="description">
        Formulario inicial para registrar un evento. Esta función se completará en el Sprint 1.
      </p>

      <form className="form">
        <label>
          Nombre del evento
          <input type="text" placeholder="Ejemplo: Boda de Ana y Luis" />
        </label>

        <label>
          Fecha del evento
          <input type="date" />
        </label>

        <label>
          Horas máximas de trabajo por día
          <input type="number" placeholder="Ejemplo: 6" />
        </label>

        <button type="button">Guardar evento demo</button>
      </form>
    </main>
  );
}

function EventoDetalle() {
  return (
    <main className="container">
      <h1>Detalle del evento</h1>
      <p className="description">
        En esta sección se mostrarán las subtareas logísticas del evento seleccionado.
      </p>

      <section className="task-card">
        <h2>Plan logístico inicial</h2>
        <p>Reservar salón</p>
        <p>Enviar invitaciones</p>
        <p>Confirmar catering</p>
        <p>Coordinar proveedores</p>
      </section>
    </main>
  );
}

function Progreso() {
  return (
    <main className="container">
      <h1>Progreso del evento</h1>
      <p className="description">
        Barra de avance para visualizar el estado general de preparación del evento.
      </p>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: "25%" }}>
          25%
        </div>
      </div>

      <p className="progress-text">1 de 4 tareas logísticas completadas.</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>Organizador de Eventos</h2>

        <div className="nav-links">
          <Link to="/hoy">Hoy</Link>
          <Link to="/crear">Crear evento</Link>
          <Link to="/evento/1">Evento</Link>
          <Link to="/progreso">Progreso</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Hoy />} />
        <Route path="/hoy" element={<Hoy />} />
        <Route path="/crear" element={<Crear />} />
        <Route path="/evento/:id" element={<EventoDetalle />} />
        <Route path="/progreso" element={<Progreso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;