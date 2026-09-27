// Ajustar estos valores a los "choices" que defina el backend.
export const TIPOS_EVENTO = [
  { value: "Boda", label: "Boda" },
  { value: "Cumpleaños", label: "Cumpleaños" },
];

export const ESTADOS_SUBTAREA = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_progreso", label: "En progreso" },
  { value: "finalizado", label: "Finalizado" },
];

export function etiquetaEstado(valor) {
  return (
    ESTADOS_SUBTAREA.find((estado) => estado.value === valor)?.label ?? valor
  );
}
