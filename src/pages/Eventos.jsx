import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listarEventos } from "../api/eventos";
import Layout from "../components/Layout";
import { formatearFechaHora } from "../utils/fechas";

function Eventos() {
  const { state } = useLocation();
  const [eventos, setEventos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    listarEventos()
      .then((lista) => activo && setEventos(lista))
      .catch((err) => activo && setError(err.message));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <Layout>
      <section className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Eventos</p>
            <h2>Mis eventos</h2>
          </div>
          <Link className="btn-link" to="/crear">
            Crear evento
          </Link>
        </div>

        {state?.mensaje && (
          <p className="alert-success" role="status">
            {state.mensaje}
          </p>
        )}

        {error && (
          <p className="alert-error" role="alert">
            {error}
          </p>
        )}

        {!error && eventos === null && <p>Cargando eventos...</p>}

        {eventos?.length === 0 && (
          <div className="empty-state">
            <p><strong>Aún no tienes eventos.</strong></p>
            <p>Crea tu primer evento para comenzar a organizar tus tareas logísticas.</p>
            <Link className="btn-link" to="/crear">
              Crear evento
            </Link>
          </div>
        )}

        {eventos?.length > 0 && (
          <ul className="event-list">
            {eventos.map((evento) => (
              <li key={evento.id}>
                <Link to={`/evento/${evento.id}`}>
                  <strong>{evento.nombre}</strong>
                  <span>
                    {evento.tipo} · {formatearFechaHora(evento.fecha_hora)} ·{" "}
                    {evento.lugar}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}

export default Eventos;
