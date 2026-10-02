import { request, USE_MOCK } from "./client";
import * as mock from "./mock";

const api = {
  login: (email, password) =>
    request("/api/login/", { method: "POST", body: { email, password } }),

  obtenerPerfil: () => request("/api/organizador/me/"),
};

export const { login, obtenerPerfil } = USE_MOCK ? mock : api;
