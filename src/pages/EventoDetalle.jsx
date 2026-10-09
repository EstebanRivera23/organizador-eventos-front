import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  actualizarEvento,
  actualizarSubtarea,
  crearSubtarea,
  eliminarEvento,
  eliminarSubtarea,
  listarSubtareas,
  obtenerEvento,
} from "../api/eventos";
import ConfirmDialog from "../components/ConfirmDialog";
import EventoForm from "../components/EventoForm";
import IconoEstado from "../components/IconoEstado";
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
  // Id de la subtarea que se está editando en la lista (null si ninguna).
  const [editandoSubtarea, setEditandoSubtarea] = useState(null);
  // Subtarea que se pidió eliminar y espera confirmación.
  const [subtareaAEliminar, setSubtareaAEliminar] = useState(null);
  const [eliminandoSubtarea, setEliminandoSubtarea] = useState(false);
  const [errorEliminarSubtarea, setErrorEliminarSubtarea] = useState("");

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

  function reemplazarSubtarea(actualizada) {
    setDatos((actuales) => ({
      ...actuales,
      subtareas: actuales.subtareas.map((subtarea) =>
        subtarea.id === actualizada.id ? actualizada : subtarea,
      ),
    }));
  }

  async function guardarSubtarea(subtarea, cambios) {
    const actualizada = await actualizarSubtarea(subtarea.id, cambios);
    reemplazarSubtarea(actualizada);
    setEditandoSubtarea(null);
    setMensajeSubtareas(
      `Listo. Se guardaron los cambios de "${actualizada.titulo}".`,
    );
  }

  async function confirmarEliminarSubtarea() {
    setEliminandoSubtarea(true);
    setErrorEliminarSubtarea("");
    try {
      await eliminarSubtarea(subtareaAEliminar.id);
      setDatos((actuales) => ({
        ...actuales,
        subtareas: actuales.subtareas.filter(
          (subtarea) => subtarea.id !== subtareaAEliminar.id,
        ),
      }));
      setMensajeSubtareas(`Listo. Se eliminó "${subtareaAEliminar.titulo}".`);
      setSubtareaAEliminar(null);
    } catch (error) {
      setErrorEliminarSubtarea(error.message);
    } finally {
      setEliminandoSubtarea(false);
    }
  }

  function cancelarEliminarSubtarea() {
    setSubtareaAEliminar(null);
    setErrorEliminarSubtarea("");
  }

  function alReprogramar(actualizada) {
    setReprogramando(null);
    reemplazarSubtarea(actualizada);
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
      <Link className="volver" to="/eventos">
        ← Eventos
      </Link>

      <div className="encabezado-fila">
        <div>
          <h1>{evento.nombre}</h1>
          <p className="sub">{formatearFechaHora(evento.fecha_hora)}</p>
        </div>

        {!editando && (
          <div className="acciones">
            <button
              type="button"
              className="btn linea"
              onClick={() => {
                setMensaje("");
                setEditando(true);
              }}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn linea peligro"
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
        <section className="panel panel-relleno formulario edicion-evento">
          <EventoForm
            evento={evento}
            textoBoton="Guardar cambios"
            onSubmit={guardarEvento}
            onCancelar={() => setEditando(false)}
          />
        </section>
      ) : (
        <dl className="panel detail-list">
          <div>
            <dt>Tipo</dt>
            <dd>{evento.tipo}</dd>
          </div>
          <div>
            <dt>Contacto del cliente</dt>
            <dd>{evento.cliente_contacto}</dd>
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

      <section className="panel hoy-group">
        <div className="grupo-cabecera section-header">
          <h2>Gestiones</h2>
          {subtareas.length > 0 && (
            <span className="grupo-resumen status">
              {subtareas.length === 1
                ? "1 gestión"
                : `${subtareas.length} gestiones`}
              , {horasTotales} h estimadas
            </span>
          )}
        </div>

        {mensajeSubtareas && (
          <p className="alert-success" role="status">
            {mensajeSubtareas}
          </p>
        )}

        {subtareas.length === 0 ? (
          <p className="grupo-vacio">Este evento todavía no tiene gestiones.</p>
        ) : (
          <ul className="subtask-list">
            {subtareas.map((subtarea) =>
              editandoSubtarea === subtarea.id ? (
                <li key={subtarea.id} className="editando">
                  <h3>Editar gestión</h3>
                  <SubtareaForm
                    subtarea={subtarea}
                    onSubmit={(cambios) => guardarSubtarea(subtarea, cambios)}
                    onCancelar={() => setEditandoSubtarea(null)}
                  />
                </li>
              ) : (
                <li key={subtarea.id}>
                  <IconoEstado estado={subtarea.estado} />
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
                    <div className="subtask-botones">
                      <button
                        type="button"
                        className="enlace"
                        aria-label={`Editar ${subtarea.titulo}`}
                        onClick={() => {
                          setMensajeSubtareas("");
                          setEditandoSubtarea(subtarea.id);
                        }}
                      >
                        Editar
                      </button>
                      {subtarea.estado !== "finalizado" && (
                        <button
                          type="button"
                          className="enlace"
                          aria-label={`Reprogramar ${subtarea.titulo}`}
                          onClick={() => {
                            setMensajeSubtareas("");
                            setReprogramando(subtarea);
                          }}
                        >
                          Reprogramar
                        </button>
                      )}
                      <button
                        type="button"
                        className="enlace rojo"
                        aria-label={`Eliminar ${subtarea.titulo}`}
                        onClick={() => {
                          setMensajeSubtareas("");
                          setSubtareaAEliminar(subtarea);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      <section className="panel panel-relleno">
        <h2>Agregar gestión</h2>
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
        abierto={subtareaAEliminar !== null}
        titulo="¿Deseas eliminar esta gestión?"
        mensaje={`Esta acción no se puede deshacer. Se eliminará "${subtareaAEliminar?.titulo ?? ""}".`}
        textoConfirmar="Sí, eliminar"
        procesando={eliminandoSubtarea}
        error={errorEliminarSubtarea}
        onConfirmar={confirmarEliminarSubtarea}
        onCancelar={cancelarEliminarSubtarea}
      />

      <ConfirmDialog
        abierto={confirmando}
        titulo="¿Deseas eliminar este evento?"
        mensaje={`Esta acción no se puede deshacer. Se eliminará "${evento.nombre}" junto con sus gestiones.`}
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
