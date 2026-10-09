import { useEffect, useRef, useState } from "react";
import { ApiError, erroresDeApi } from "../api/client";
import { actualizarSubtarea } from "../api/eventos";
import { formatearFecha } from "../utils/fechas";
import Campo from "./Campo";

const enHoras = (horas) => `${Number(horas)} h`;

// Diálogo para cambiar la fecha de una gestión. Si el día elegido queda por
// encima del límite diario, el backend responde 409 con las cifras y aquí se
// ofrecen las dos salidas: mover a otro día o reducir las horas.
function ReprogramarDialog({ gestion, onCerrar, onGuardado }) {
  const dialogRef = useRef(null);
  const tituloRef = useRef(null);

  // "fecha" (elegir día), "conflicto" (aviso con cifras) o "reducir" (horas).
  const [paso, setPaso] = useState("fecha");
  const [fecha, setFecha] = useState(gestion.fecha_objetivo);
  const [horas, setHoras] = useState("");
  const [conflicto, setConflicto] = useState(null);
  const [errorCampo, setErrorCampo] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  // En cada paso el foco va al campo que hay que llenar; si el paso no tiene
  // campo (el aviso de conflicto), va al título para que el lector de
  // pantalla anuncie dónde quedó la persona.
  useEffect(() => {
    const campo = dialogRef.current.querySelector("input");
    (campo ?? tituloRef.current)?.focus();
  }, [paso]);

  function cerrar() {
    if (guardando) return;
    dialogRef.current.close();
    onCerrar();
  }

  function irA(nuevoPaso) {
    setErrorCampo("");
    setErrorGeneral("");
    setPaso(nuevoPaso);
  }

  async function guardar(cambios) {
    setGuardando(true);
    setErrorCampo("");
    setErrorGeneral("");

    try {
      const actualizada = await actualizarSubtarea(gestion.id, cambios);
      dialogRef.current.close();
      onGuardado(actualizada);
    } catch (error) {
      setGuardando(false);

      if (
        error instanceof ApiError &&
        error.status === 409 &&
        error.data?.codigo === "sobrecarga_diaria"
      ) {
        setConflicto({ ...error.data.conflicto, mensaje: error.message });
        setPaso("conflicto");
        return;
      }

      const { campos, general } = erroresDeApi(error, [
        "fecha_objetivo",
        "horas_estimadas",
      ]);
      const delCampo = campos.fecha_objetivo ?? campos.horas_estimadas ?? "";
      setErrorCampo(delCampo);
      setErrorGeneral(delCampo ? "" : general);
    }
  }

  function enviarFecha(e) {
    e.preventDefault();

    if (!fecha) {
      setErrorCampo("Elige la nueva fecha.");
      return;
    }
    if (fecha === gestion.fecha_objetivo) {
      setErrorCampo("Esa es la fecha que ya tiene. Elige otro día.");
      return;
    }
    guardar({ fecha_objetivo: fecha });
  }

  function enviarHoras(e) {
    e.preventDefault();

    const nuevas = Number(horas);
    if (horas === "" || Number.isNaN(nuevas) || nuevas <= 0) {
      setErrorCampo("Escribe las nuevas horas, mayores a 0.");
      return;
    }
    if (nuevas >= Number(gestion.horas_estimadas)) {
      setErrorCampo(
        `Para reducir, escribe menos de las ${enHoras(gestion.horas_estimadas)} que tiene ahora.`,
      );
      return;
    }
    guardar({ fecha_objetivo: fecha, horas_estimadas: nuevas });
  }

  // Horas que todavía caben ese día con las demás gestiones ya planificadas.
  const horasLibres = conflicto
    ? Math.max(
        0,
        Number(conflicto.limite_horas_dia) -
          Number(conflicto.horas_otras_gestiones),
      )
    : 0;

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog reprogramar-dialog"
      aria-labelledby="reprogramar-titulo"
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
    >
      {paso === "fecha" && (
        <form onSubmit={enviarFecha} noValidate>
          <h3 id="reprogramar-titulo" ref={tituloRef} tabIndex={-1}>
            {conflicto ? "Mover a otro día" : "Reprogramar gestión"}
          </h3>
          <p>
            <strong>{gestion.titulo}</strong> está para el{" "}
            {formatearFecha(gestion.fecha_objetivo)} y toma{" "}
            {enHoras(gestion.horas_estimadas)}.
            {conflicto &&
              ` El ${formatearFecha(conflicto.fecha)} no te cabe: elige otro día.`}
          </p>

          <div className="form-grid">
            {errorGeneral && (
              <p className="alert-error" role="alert">
                {errorGeneral}
              </p>
            )}

            <Campo
              type="date"
              label="Nueva fecha"
              name="fecha_objetivo"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setErrorCampo("");
              }}
              error={errorCampo}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={cerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Reprogramar"}
            </button>
          </div>
        </form>
      )}

      {paso === "conflicto" && (
        <div>
          <h3 id="reprogramar-titulo" ref={tituloRef} tabIndex={-1}>
            Ese día quedaría sobrecargado
          </h3>

          <p className="conflicto-cifras" role="alert">
            {conflicto.mensaje}
          </p>
          <p>
            El {formatearFecha(conflicto.fecha)} ya tienes{" "}
            {enHoras(conflicto.horas_otras_gestiones)} en otras gestiones y{" "}
            <strong>{gestion.titulo}</strong> suma{" "}
            {enHoras(conflicto.horas_gestion)}. Todavía no se guardó ningún
            cambio.
          </p>

          <p className="conflicto-pregunta">¿Cómo quieres resolverlo?</p>
          <div className="dialog-opciones">
            <button
              type="button"
              className="btn-link"
              onClick={() => irA("fecha")}
            >
              Mover a otro día
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setHoras("");
                irA("reducir");
              }}
            >
              Reducir horas estimadas
            </button>
            <button type="button" className="btn-secondary" onClick={cerrar}>
              Cancelar y dejarla como estaba
            </button>
          </div>
        </div>
      )}

      {paso === "reducir" && (
        <form onSubmit={enviarHoras} noValidate>
          <h3 id="reprogramar-titulo" ref={tituloRef} tabIndex={-1}>
            Reducir horas estimadas
          </h3>
          <p>
            <strong>{gestion.titulo}</strong> toma{" "}
            {enHoras(gestion.horas_estimadas)}.{" "}
            {horasLibres > 0
              ? `El ${formatearFecha(conflicto.fecha)} te caben ${enHoras(horasLibres)} más.`
              : `El ${formatearFecha(conflicto.fecha)} ya está lleno con tus otras gestiones: es mejor moverla a otro día.`}
          </p>

          {horasLibres > 0 && (
            <div className="form-grid">
              {errorGeneral && (
                <p className="alert-error" role="alert">
                  {errorGeneral}
                </p>
              )}

              <Campo
                type="number"
                inputMode="decimal"
                min="0.5"
                step="0.5"
                label="Nuevas horas estimadas"
                name="horas_estimadas"
                ayuda={`Máximo ${enHoras(horasLibres)} para que quepa ese día.`}
                value={horas}
                onChange={(e) => {
                  setHoras(e.target.value);
                  setErrorCampo("");
                }}
                error={errorCampo}
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => irA("conflicto")}
              disabled={guardando}
            >
              Volver
            </button>
            {horasLibres > 0 ? (
              <button type="submit" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar horas"}
              </button>
            ) : (
              <button type="button" onClick={() => irA("fecha")}>
                Mover a otro día
              </button>
            )}
          </div>
        </form>
      )}
    </dialog>
  );
}

export default ReprogramarDialog;
