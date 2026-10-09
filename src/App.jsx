import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Configuracion from "./pages/Configuracion";
import CrearEvento from "./pages/CrearEvento";
import EventoDetalle from "./pages/EventoDetalle";
import Eventos from "./pages/Eventos";
import Hoy from "./pages/Hoy";
import Progreso from "./pages/Progreso";
import Registro from "./pages/Registro";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

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

          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <Configuracion />
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
