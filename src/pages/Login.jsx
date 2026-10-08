import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Campo from "../components/Campo";
import { erroresDeApi } from "../api/client";
import logo from "../assets/brand/logo-eventflow.svg";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, isAuthenticated, olvidarCierreVoluntario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [valores, setValores] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Al llegar a /login, el "Cerrar sesión" que nos trajo ya cumplió su papel.
  useEffect(() => {
    olvidarCierreVoluntario();
  }, [olvidarCierreVoluntario]);

  // A dónde quería ir el usuario (con sus filtros en la URL), o /hoy por
  // defecto.
  const from = location.state?.from;
  const destino = from
    ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
    : "/hoy";

  // Ya hay sesión (ej. se refrescó la página en /login): manda directo ahí.
  if (isAuthenticated) {
    return <Navigate to={destino} replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores({});
    setErrorGeneral("");
    setEnviando(true);

    try {
      await login(valores.email.trim(), valores.password);
      navigate(destino, { replace: true });
    } catch (error) {
      const { campos, general } = erroresDeApi(error, ["email", "password"]);
      setErrores(campos);
      setErrorGeneral(general);
      setEnviando(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-brand">
        <img src={logo} alt="" width="38" height="38" />
        <span className="login-brand-name">
          Event<span>Flow</span>
        </span>
      </div>

      <header className="login-header">
        <h1>Organizador de Eventos Independientes</h1>
      </header>

      <section className="login-card">
        <h2>Iniciar sesión</h2>
        <p>Ingresa con tu correo y una contraseña de al menos 6 caracteres.</p>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          {errorGeneral && (
            <p className="alert-error" role="alert">
              {errorGeneral}
            </p>
          )}

          <Campo
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="usuario@correo.com"
            value={valores.email}
            onChange={handleChange}
            error={errores.email}
            required
          />

          <Campo
            label="Contraseña"
            name="password"
            type="password"
            placeholder="********"
            value={valores.password}
            onChange={handleChange}
            error={errores.password}
            required
            minLength={6}
          />

          <button type="submit" disabled={enviando}>
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
