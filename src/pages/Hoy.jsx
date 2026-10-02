import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarEventos, obtenerGestionesHoy } from "../api/eventos";
import Layout from "../components/Layout";
import { claseEstado, etiquetaEstado } from "../constants";
import { diasEntre, formatearFecha } from "../utils/fechas";

// El orden de los grupos y de las gestiones dentro de cada uno es el que
// entrega la API; aquí no se reordena nada.
const GRUPOS = [
  {
    clave: "vencidas",
    titulo: "Vencidas",
    descripcion: "Su fecha objetivo ya pasó. Atiéndelas primero.",
    vacio: "No tienes gestiones vencidas.",
  },
  {
    clave: "para_hoy",
    titulo: "Para hoy",
    descripcion: "Su fecha objetivo es hoy.",
    vacio: "No tienes gestiones para hoy.",
  },
  {
    clave: "proximas",
    titulo: "Próximas",
    descripcion: "Todavía tienen tiempo; no requieren atención inmediata.",
    vacio: "No tienes gestiones próximas.",
  },
];

const plural = (n, singular, pluralizado) =>
  `${n} ${n === 1 ? singular : pluralizado}`;

// Texto de urgencia de una gestión, calculado contra la fecha que el backend
// considera "hoy" para que coincida con el grupo en el que la puso.
function textoUrgencia(grupo, fechaObjetivo, fechaActual) {
  if (grupo === "para_hoy") return "Vence hoy";

  const dias = Math.abs(diasEntre(fechaActual, fechaObjetivo));
  if (grupo === "vencidas") {
    return dias === 1 ? "Venció ayer" : `Venció hace ${dias} días`;
  }
  return dias === 1 ? "Vence mañana" : `Faltan ${dias} días`;
}

// Mientras llegan los datos se muestra la silueta de la vista, para que el
// contenido no "salte" al aparecer.
function Cargando() {
  return (
    <div role="status" aria-live="polite">
      <span className="visually-hidden">Cargando tus gestiones...</span>
      <div className="hoy-skeleton hoy-skeleton-hero" aria-hidden="true" />
      <div className="hoy-list hoy-skeleton-list" aria-hidden="true">
        <div className="hoy-skeleton" />
        <div className="hoy-skeleton" />
        <div className="hoy-skeleton" />
      </div>
    </div>
  );
}

function Hoy() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  // Cambia cada vez que se pulsa "Reintentar" para repetir la petición.
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    // La API de /hoy solo trae el id del evento; los nombres salen de la
    // lista de eventos del organizador.
    Promise.all([obtenerGestionesHoy(), listarEventos()])
      .then(([gestiones, eventos]) => {
        if (!activo) return;
        const nombres = Object.fromEntries(
          eventos.map((evento) => [evento.id, evento.nombre]),
        );
        setDatos({ gestiones, nombres, hayEventos: eventos.length > 0 });
      })
      .catch((err) => activo && setError(err.message));

    return () => {
      activo = false;
    };
  }, [intento]);

  function reintentar() {
    setError("");
    setDatos(null);
    setIntento((actual) => actual + 1);
  }

  if (error) {
    return (
      <Layout>
        <section className="content-card hoy-state" role="alert">
          <h2>No pudimos cargar tus gestiones</h2>
          <p>{error}</p>
          <p>
            Tus datos no se perdieron. Revisa tu conexión e inténtalo de nuevo.
          </p>
          <button type="button" className="btn-link" onClick={reintentar}>
            Reintentar
          </button>
        </section>
      </Layout>
    );
  }

  if (datos === null) {
    return (
      <Layout>
        <Cargando />
      </Layout>
    );
  }

  const { gestiones, nombres, hayEventos } = datos;
  const cantidad = (clave) => gestiones[clave]?.length ?? 0;
  const urgentes = cantidad("vencidas") + cantidad("para_hoy");
  const total = urgentes + cantidad("proximas");

  return (
    <Layout>
      <section className="hero-card">
        <div>
          <p className="eyebrow">Vista Hoy</p>
          <h2>Gestiones urgentes del día</h2>
          <p>
            Hoy es {formatearFecha(gestiones.fecha_actual)}. Primero aparecen
            las gestiones vencidas, luego las de hoy y al final las próximas.
          </p>
        </div>

        <div className="hero-number">
          <span>{urgentes}</span>
          <p>{urgentes === 1 ? "Requiere" : "Requieren"} atención hoy</p>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumen de gestiones">
        {GRUPOS.map((grupo) => (
          <article key={grupo.clave}>
            <span>{grupo.titulo}</span>
            <strong>{cantidad(grupo.clave)}</strong>
          </article>
        ))}
      </section>

      {total === 0 ? (
        <section className="content-card hoy-state">
          <h2>
            {hayEventos
              ? "No tienes gestiones pendientes"
              : "Aún no tienes gestiones"}
          </h2>
          <p>
            {hayEventos
              ? "Estás al día. Cuando agregues subtareas a tus eventos, aquí las verás ordenadas por urgencia."
              : "Crea tu primer evento y agrégale subtareas para verlas aquí ordenadas por urgencia."}
          </p>
          <div className="hoy-state-actions">
            <Link className="btn-link" to="/crear">
              Crear evento
            </Link>
            {hayEventos && <Link to="/eventos">Ver mis eventos</Link>}
          </div>
        </section>
      ) : (
        GRUPOS.map((grupo) => {
          const lista = gestiones[grupo.clave] ?? [];
          const idTitulo = `hoy-${grupo.clave}`;

          return (
            <section
              key={grupo.clave}
              className={`hoy-group ${grupo.clave}`}
              aria-labelledby={idTitulo}
            >
              <div className="hoy-group-header">
                <h2 id={idTitulo}>{grupo.titulo}</h2>
                <span className="hoy-count">
                  {plural(lista.length, "gestión", "gestiones")}
                </span>
              </div>
              <p>{lista.length > 0 ? grupo.descripcion : grupo.vacio}</p>

              {lista.length > 0 && (
                <ul className="hoy-list">
                  {lista.map((gestion) => (
                    <li key={gestion.id}>
                      <article
                        className={`event-card gestion-card ${grupo.clave}`}
                      >
                        <div className="card-header">
                          <span className="urgency-badge">
                            {textoUrgencia(
                              grupo.clave,
                              gestion.fecha_objetivo,
                              gestiones.fecha_actual,
                            )}
                          </span>
                          <span
                            className={`subtask-status ${claseEstado(gestion.estado)}`}
                          >
                            {etiquetaEstado(gestion.estado)}
                          </span>
                        </div>

                        <h3>{gestion.titulo}</h3>
                        <p>
                          <Link to={`/evento/${gestion.evento}`}>
                            {nombres[gestion.evento] ?? "Ver evento"}
                          </Link>
                        </p>
                        {gestion.descripcion && <p>{gestion.descripcion}</p>}

                        <div className="card-footer">
                          <span>{formatearFecha(gestion.fecha_objetivo)}</span>
                          <span>{Number(gestion.horas_estimadas)} h</span>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}
    </Layout>
  );
}

export default Hoy;
