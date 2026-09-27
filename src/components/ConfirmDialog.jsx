import { useEffect, useRef } from "react";

// Modal nativo (<dialog>): bloquea el fondo, atrapa el foco y se cierra con Esc.
function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  procesando = false,
  error,
  onConfirmar,
  onCancelar,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (abierto && !dialog.open) dialog.showModal();
    if (!abierto && dialog.open) dialog.close();
  }, [abierto]);

  function handleCancel(e) {
    e.preventDefault();
    if (!procesando) onCancelar();
  }

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-titulo"
      onCancel={handleCancel}
    >
      <h3 id="confirm-dialog-titulo">{titulo}</h3>
      <p>{mensaje}</p>

      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancelar}
          disabled={procesando}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn-danger"
          onClick={onConfirmar}
          disabled={procesando}
        >
          {procesando ? "Eliminando..." : textoConfirmar}
        </button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
