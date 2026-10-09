import { request, USE_MOCK } from "./client";
import * as mock from "./mock";

const api = {
  obtenerLimiteDiario: () => request("/api/organizador/limite-diario/"),

  actualizarLimiteDiario: (horas) =>
    request("/api/organizador/limite-diario/", {
      method: "PUT",
      body: { limite_horas_dia: horas },
    }),
};

export const { obtenerLimiteDiario, actualizarLimiteDiario } = USE_MOCK
  ? mock
  : api;
