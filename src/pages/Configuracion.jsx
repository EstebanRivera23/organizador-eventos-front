import { useEffect, useState } from "react";
import { obtenerLimiteDiario } from "../api/limite";
import abejorroConfig from "../assets/brand/abejorro-config.svg";
import Layout from "../components/Layout";
import { numeroDeHoras } from "../utils/horas";

const enHoras = (horas) =>
  `${numeroDeHoras(horas)} ${Number(horas) === 1 ? "hora" : "horas"}`;

// El límite diario solo se muestra: no se cambia desde la app. El backend
// sigue teniendo el endpoint para modificarlo, pero esta pantalla no lo usa.
function Configuracion() {
  const [limite, setLimite] = useState(null);
  const [errorCarga, setErrorCarga] = useState("");
  // Cambia cada vez que se pulsa "Reintentar" para repetir la petición.
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    obtenerLimiteDiario()
      .then((datos) => activo && setLimite(datos.limite_horas_dia))
      .catch((err) => activo && setErrorCarga(err.message));

    return () => {
      activo = false;
    };
  }, [intento]);

  function reintentar() {
    setErrorCarga("");
    setIntento((actual) => actual + 1);
  }

  if (errorCarga) {
    return (
      <Layout>
        <section className="panel hoy-state" role="alert">
          <h2>No pudimos cargar tu límite diario</h2>
          <p>{errorCarga}</p>
          <p>Revisa tu conexión e inténtalo de nuevo.</p>
          <button type="button" className="btn-link" onClick={reintentar}>
            Reintentar
          </button>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="encabezado">
        <h1>Configuración</h1>
        <p className="sub">Ajustes de tu trabajo diario.</p>
      </header>

      <div className="config">
        <section className="panel panel-relleno formulario">
          <h2>Límite diario de horas</h2>
          <p>
            Es el máximo de horas de gestión que puedes dedicarle a tus eventos
            en un día. Si al reprogramar una gestión te pasas de este límite, te
            avisamos antes de guardar.
          </p>

          {limite === null ? (
            <p role="status">Cargando tu límite...</p>
          ) : (
            <p className="limite-actual">
              Tu límite: <strong>{enHoras(limite)} por día</strong>
            </p>
          )}
        </section>

        <aside className="vidrio config-adorno">
          <img src={abejorroConfig} alt="" />
          <strong>Todo a tu medida</strong>
          <p>La colmena cuida que tu día no se llene de más.</p>
        </aside>
      </div>
    </Layout>
  );
}

export default Configuracion;
