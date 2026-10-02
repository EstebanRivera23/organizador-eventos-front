import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Envuelve una ruta privada: si no hay sesión válida, redirige a /login
// recordando a dónde se quería ir para volver ahí después de iniciar sesión.
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, cierreVoluntario } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-checking" role="status">
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Tras un "Cerrar sesión" voluntario no se recuerda la página: quien
    // entre después (quizá otro organizador) debe empezar en /hoy.
    const state = cierreVoluntario ? undefined : { from: location };
    return <Navigate to="/login" state={state} replace />;
  }

  return children;
}

export default ProtectedRoute;
