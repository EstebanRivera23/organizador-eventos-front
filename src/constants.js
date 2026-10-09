// Ajustar estos valores a los "choices" que defina el backend.
export const TIPOS_EVENTO = [
  { value: "Boda", label: "Boda" },
  { value: "Cumpleaños", label: "Cumpleaños" },
];

// Mismo rango que valida el backend en /api/organizador/limite-diario/.
export const LIMITE_DIARIO = { minimo: 1, maximo: 16, porDefecto: 6 };

// Los valores son los que guarda el backend; la etiqueta es lo que se muestra.
export const ESTADOS_SUBTAREA = [
  { value: "por hacer", label: "Pendiente" },
  { value: "en curso", label: "En progreso" },
  { value: "finalizado", label: "Finalizado" },
];

// En Hoy no salen las finalizadas, así que el filtro no las ofrece.
export const ESTADOS_FILTRO_HOY = ESTADOS_SUBTAREA.filter(
  (estado) => estado.value !== "finalizado",
);

// Antes el formulario guardaba "pendiente" / "en_progreso": las gestiones
// viejas pueden venir así y se tratan como su equivalente actual.
const EQUIVALENCIAS_ESTADO = {
  pendiente: "por hacer",
  en_progreso: "en curso",
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

const CLASES_ESTADO = {
  "por hacer": "pendiente",
  "en curso": "en_progreso",
};

// Clase CSS del estado (sin espacios), para pintar la etiqueta.
export function claseEstado(valor) {
  const estado = normalizarEstado(valor);
  return CLASES_ESTADO[estado] ?? estado.replace(/\s+/g, "_");
}
