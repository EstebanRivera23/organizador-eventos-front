// Ajustar estos valores a los "choices" que defina el backend.
export const TIPOS_EVENTO = [
  { value: "Boda", label: "Boda" },
  { value: "Cumpleaños", label: "Cumpleaños" },
];

// Mismo rango que valida el backend en /api/organizador/limite-diario/.
export const LIMITE_DIARIO = { minimo: 1, maximo: 16, porDefecto: 6 };

export const ESTADOS_SUBTAREA = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_progreso", label: "En progreso" },
  { value: "finalizado", label: "Finalizado" },
];

// El backend usa "por hacer" / "en curso" como estados por defecto; se tratan
// como equivalentes a los valores del formulario.
const EQUIVALENCIAS_ESTADO = {
  "por hacer": "pendiente",
  "en curso": "en_progreso",
};

function normalizarEstado(valor) {
  const estado = String(valor ?? "").trim().toLowerCase();
  return EQUIVALENCIAS_ESTADO[estado] ?? estado;
}

export function etiquetaEstado(valor) {
  const normalizado = normalizarEstado(valor);
  return (
    ESTADOS_SUBTAREA.find((estado) => estado.value === normalizado)?.label ??
    valor
  );
}

// Clase CSS del estado (sin espacios), para pintar la etiqueta.
export function claseEstado(valor) {
  return normalizarEstado(valor).replace(/\s+/g, "_");
}
