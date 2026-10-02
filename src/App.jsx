import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import CrearEvento from "./pages/CrearEvento";
import EventoDetalle from "./pages/EventoDetalle";
import Eventos from "./pages/Eventos";
import "./App.css";

// TODO (KAN-37): reemplazar con datos reales de GET /api/subtareas/hoy/.
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Hoy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hoy"
            element={
              <ProtectedRoute>
                <Hoy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eventos"
            element={
              <ProtectedRoute>
                <Eventos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear"
            element={
              <ProtectedRoute>
                <CrearEvento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evento/:id"
            element={
              <ProtectedRoute>
                <EventoDetalle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progreso"
            element={
              <ProtectedRoute>
                <Progreso />
              </ProtectedRoute>
            }
          />

          {/* Cualquier URL desconocida vuelve a /hoy (o a /login si no hay sesión). */}
          <Route path="*" element={<Navigate to="/hoy" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
