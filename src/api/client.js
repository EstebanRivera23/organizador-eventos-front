const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

// Sin URL configurada (o con VITE_USE_MOCK=true) se usan datos locales.
export const USE_MOCK = !API_URL || import.meta.env.VITE_USE_MOCK === "true";

export class ApiError extends Error {
  constructor(status, data) {
    super(
      data?.detail ??
        data?.non_field_errors?.[0] ??
        `Error ${status} al comunicarse con el servidor.`,
    );
    this.status = status;
    this.data = data;
  }
}

export async function request(path, { method = "GET", body } = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, { detail: "No se pudo conectar con el servidor." });
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);
  return data;
}

// DRF puede devolver una lista simple o una respuesta paginada.
export function comoLista(data) {
  return Array.isArray(data) ? data : (data?.results ?? []);
}

// Convierte un error de DRF ({ campo: ["mensaje"] }) en errores por campo
// que los formularios pueden mostrar.
export function erroresDeApi(error, camposConocidos) {
  const campos = {};

  if (error instanceof ApiError && error.status === 400 && error.data) {
    for (const [campo, mensajes] of Object.entries(error.data)) {
      if (camposConocidos.includes(campo)) {
        campos[campo] = Array.isArray(mensajes) ? mensajes[0] : String(mensajes);
      }
    }
  }

  const general =
    Object.keys(campos).length > 0
      ? "Revisa los campos marcados."
      : error.message || "Ocurrió un error inesperado.";

  return { campos, general };
}
