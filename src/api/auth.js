import { request, USE_MOCK } from "./client";
import * as mock from "./mock";

const api = {
  login: (email, password) =>
    request("/api/login/", { method: "POST", body: { email, password } }),

  registrar: (nombre, email, password) =>
    request("/api/registro/", {
      method: "POST",
      body: { nombre, email, password },
    }),

  obtenerPerfil: () => request("/api/organizador/me/"),
};

export const { login, registrar, obtenerPerfil } = USE_MOCK ? mock : api;
