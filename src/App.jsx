import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import CrearEvento from "./pages/CrearEvento";
import EventoDetalle from "./pages/EventoDetalle";
import Eventos from "./pages/Eventos";
import Hoy from "./pages/Hoy";
import "./App.css";

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
