import { comoLista, request, USE_MOCK } from "./client";
import * as mock from "./mock";

const api = {
  listarEventos: () => request("/api/eventos/").then(comoLista),

  obtenerEvento: (id) => request(`/api/eventos/${id}/`),

  crearEvento: (datos) =>
    request("/api/eventos/", { method: "POST", body: datos }),

  actualizarEvento: (id, datos) =>
    request(`/api/eventos/${id}/`, { method: "PUT", body: datos }),

  eliminarEvento: (id) => request(`/api/eventos/${id}/`, { method: "DELETE" }),

  listarSubtareas: (eventoId) =>
    request(`/api/eventos/${eventoId}/subtareas/`).then(comoLista),

  crearSubtarea: (eventoId, datos) =>
    request(`/api/eventos/${eventoId}/subtareas/`, {
      method: "POST",
      body: datos,
    }),
};

export const {
  listarEventos,
  obtenerEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  listarSubtareas,
  crearSubtarea,
} = USE_MOCK ? mock : api;
