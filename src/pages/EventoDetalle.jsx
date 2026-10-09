import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  actualizarEvento,
  crearSubtarea,
  eliminarEvento,
  listarSubtareas,
  obtenerEvento,
} from "../api/eventos";
import ConfirmDialog from "../components/ConfirmDialog";
import EventoForm from "../components/EventoForm";
import Layout from "../components/Layout";
import ReprogramarDialog from "../components/ReprogramarDialog";
import SubtareaForm from "../components/SubtareaForm";
import { claseEstado, etiquetaEstado } from "../constants";
import { formatearFecha, formatearFechaHora } from "../utils/fechas";
import { mensajeReprogramada } from "../utils/gestiones";

function EventoDetalle() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    id: null,
    evento: null,
    subtareas: [],
    error: "",
  });
  const [mensaje, setMensaje] = useState(state?.mensaje ?? "");
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");
  // Subtarea que se está reprogramando (null si el diálogo está cerrado).
  const [reprogramando, setReprogramando] = useState(null);
  const [mensajeSubtareas, setMensajeSubtareas] = useState("");

  useEffect(() => {
    let activo = true;

    Promise.all([obtenerEvento(id), listarSubtareas(id)])
      .then(([evento, subtareas]) => {
        if (activo) setDatos({ id, evento, subtareas, error: "" });
      })
      .catch((error) => {
        if (!activo) return;
        setDatos({
          id,
          evento: null,
          subtareas: [],
          error:
            error.status === 404
              ? "El evento no existe o fue eliminado."
              : error.message,
        });
      });

    return () => {
      activo = false;
    };
  }, [id]);

  const cargando = datos.id !== id;
  const { evento, subtareas } = datos;
  const horasTotales = subtareas.reduce(
    (total, subtarea) => total + Number(subtarea.horas_estimadas || 0),
    0,
  );

  async function guardarEvento(cambios) {
    const actualizado = await actualizarEvento(id, cambios);
    setDatos((actuales) => ({ ...actuales, evento: actualizado }));
    setEditando(false);
    setMensaje("Evento actualizado correctamente.");
  }

  async function agregarSubtarea(nueva) {
    const creada = await crearSubtarea(id, nueva);
    setDatos((actuales) => ({
      ...actuales,
      subtareas: [...actuales.subtareas, creada],
    }));
  }

  function alReprogramar(actualizada) {
    setReprogramando(null);
    setDatos((actuales) => ({
      ...actuales,
      subtareas: actuales.subtareas.map((subtarea) =>
        subtarea.id === actualizada.id ? actualizada : subtarea,
      ),
    }));
    setMensajeSubtareas(mensajeReprogramada(actualizada));
  }

  async function confirmarEliminar() {
    setEliminando(true);
    setErrorEliminar("");
    try {
      await eliminarEvento(id);
      navigate("/eventos", {
        state: { mensaje: "Evento eliminado correctamente." },
      });
    } catch (error) {
      setErrorEliminar(error.message);
      setEliminando(false);
    }
  }

  function cancelarEliminar() {
    setConfirmando(false);
    setErrorEliminar("");
  }

  if (cargando) {
    return (
      <Layout>
        <section className="content-card">
          <p>Cargando evento...</p>
        </section>
      </Layout>
    );
  }

  if (datos.error) {
    return (
      <Layout>
        <section className="content-card">
          <p className="alert-error" role="alert">
            {datos.error}
          </p>
          <Link to="/eventos">Volver a la lista de eventos</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Detalle del evento</p>
            <h2>{evento.nombre}</h2>
          </div>

          {!editando && (
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setMensaje("");
                  setEditando(true);
                }}
              >
                Editar
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => setConfirmando(true)}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

        {mensaje && (
          <p className="alert-success" role="status">
            {mensaje}
          </p>
        )}

        {editando ? (
          <EventoForm
            evento={evento}
            textoBoton="Guardar cambios"
            onSubmit={guardarEvento}
            onCancelar={() => setEditando(false)}
          />
        ) : (
          <dl className="detail-list">
            <div>
              <dt>Tipo</dt>
              <dd>{evento.tipo}</dd>
            </div>
            <div>
              <dt>Cliente / contacto</dt>
              <dd>{evento.cliente_contacto}</dd>
            </div>
            <div>
              <dt>Fecha y hora</dt>
              <dd>{formatearFechaHora(evento.fecha_hora)}</dd>
            </div>
            <div>
              <dt>Lugar</dt>
              <dd>{evento.lugar}</dd>
            </div>
            <div>
              <dt>Plazo límite</dt>
              <dd>{formatearFecha(evento.plazo_limite)}</dd>
            </div>
          </dl>
        )}
      </section>

      <section className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Logística</p>
            <h2>Subtareas</h2>
          </div>
          {subtareas.length > 0 && (
            <span className="status">
              {subtareas.length} · {horasTotales} h estimadas
            </span>
          )}
        </div>

        {mensajeSubtareas && (
          <p className="alert-success" role="status">
            {mensajeSubtareas}
          </p>
        )}

        {subtareas.length === 0 ? (
          <p>Este evento todavía no tiene subtareas.</p>
        ) : (
          <ul className="subtask-list">
            {subtareas.map((subtarea) => (
              <li key={subtarea.id}>
                <div>
                  <strong>{subtarea.titulo}</strong>
                  {subtarea.descripcion && <p>{subtarea.descripcion}</p>}
                  <small>
                    {formatearFecha(subtarea.fecha_objetivo)} ·{" "}
                    {subtarea.horas_estimadas} h
                  </small>
                </div>
                <div className="subtask-acciones">
                  <span
                    className={`subtask-status ${claseEstado(subtarea.estado)}`}
                  >
                    {etiquetaEstado(subtarea.estado)}
                  </span>
                  {subtarea.estado !== "finalizado" && (
                    <button
                      type="button"
                      className="btn-suave"
                      aria-label={`Reprogramar ${subtarea.titulo}`}
                      onClick={() => {
                        setMensajeSubtareas("");
                        setReprogramando(subtarea);
                      }}
                    >
                      Reprogramar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <h3 className="subsection-title">Agregar subtarea</h3>
        <SubtareaForm onSubmit={agregarSubtarea} />
      </section>

      {reprogramando && (
        <ReprogramarDialog
          key={reprogramando.id}
          gestion={reprogramando}
          onCerrar={() => setReprogramando(null)}
          onGuardado={alReprogramar}
        />
      )}

      <ConfirmDialog
        abierto={confirmando}
        titulo="¿Deseas eliminar este evento?"
        mensaje={`Esta acción no se puede deshacer. Se eliminará "${evento.nombre}" junto con sus subtareas.`}
        textoConfirmar="Sí, eliminar"
        procesando={eliminando}
        error={errorEliminar}
        onConfirmar={confirmarEliminar}
        onCancelar={cancelarEliminar}
      />
    </Layout>
  );
}

export default EventoDetalle;
