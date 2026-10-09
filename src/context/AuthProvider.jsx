import { useCallback, useEffect, useRef, useState } from "react";
import {
  getToken,
  setToken as persistToken,
  TOKEN_KEY,
  USE_MOCK,
} from "../api/client";
import {
  login as loginApi,
  obtenerPerfil,
  registrar as registrarApi,
} from "../api/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [organizador, setOrganizador] = useState(null);
  // Si ya hay token guardado, arrancamos "cargando" hasta validarlo contra
  // el backend; si no hay token, no hay nada que esperar.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  // Distingue "Cerrar sesión" (voluntario) de una sesión que expiró: solo en
  // el segundo caso tiene sentido volver a la página donde se estaba.
  const [cierreVoluntario, setCierreVoluntario] = useState(false);

  // Token para el que ya se tiene el perfil cargado.
  const perfilDe = useRef(null);

  const cerrarSesion = useCallback((voluntario) => {
    perfilDe.current = null;
    persistToken(null);
    setTokenState(null);
    setOrganizador(null);
    setLoading(false);
    setCierreVoluntario(voluntario);
  }, []);

  const logout = useCallback(() => cerrarSesion(true), [cerrarSesion]);
  const expirarSesion = useCallback(() => cerrarSesion(false), [cerrarSesion]);

  // La marca solo aplica a la redirección que provoca el propio cierre; una
  // vez en /login se descarta para que la navegación posterior sí recuerde
  // su destino.
  const olvidarCierreVoluntario = useCallback(
    () => setCierreVoluntario(false),
    [],
  );

  // Si llega un 401 desde cualquier llamada a la API (token vencido o
  // inválido), se cierra la sesión de inmediato en toda la app.
  useEffect(() => {
    window.addEventListener("auth:unauthorized", expirarSesion);
    return () =>
      window.removeEventListener("auth:unauthorized", expirarSesion);
  }, [expirarSesion]);

  // Mantiene la sesión igual en todas las pestañas: el evento "storage" solo
  // llega a las OTRAS pestañas cuando una cambia el token. En modo mock no
  // aplica, porque ahí la sesión vive en la memoria de cada pestaña.
  useEffect(() => {
    if (USE_MOCK) return;

    function sincronizar(evento) {
      if (evento.key !== null && evento.key !== TOKEN_KEY) return;

      const nuevo = getToken();
      if (nuevo === token) return;

      if (!nuevo) {
        cerrarSesion(true);
      } else {
        // Otra pestaña inició sesión (quizá con otro organizador): se
        // revalida el token y se recargan los datos con él.
        perfilDe.current = null;
        setOrganizador(null);
        setLoading(true);
        setTokenState(nuevo);
      }
    }

    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, [token, cerrarSesion]);

  // Valida el token contra el backend en vez de confiar ciegamente en lo
  // que haya en localStorage. Tras un login no hace falta: la respuesta ya
  // trae el perfil.
  useEffect(() => {
    if (!token || perfilDe.current === token) return;

    let cancelado = false;

    obtenerPerfil()
      .then((datos) => {
        if (cancelado) return;
        perfilDe.current = token;
        setOrganizador(datos);
      })
      .catch((error) => {
        // Solo un 401 significa que el token no sirve. Un fallo de red o un
        // 5xx (backend caído o dormido) no debe borrar una sesión válida.
        if (!cancelado && error?.status === 401) expirarSesion();
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [token, expirarSesion]);

  // El login y el registro responden lo mismo: el token y el perfil.
  function iniciarSesion(datos) {
    setCierreVoluntario(false);
    perfilDe.current = datos.token;
    persistToken(datos.token);
    setTokenState(datos.token);
    setOrganizador(datos.organizador);
    return datos.organizador;
  }

  async function login(email, password) {
    return iniciarSesion(await loginApi(email, password));
  }

  async function registrar(nombre, email, password) {
    return iniciarSesion(await registrarApi(nombre, email, password));
  }

  const value = {
    organizador,
    isAuthenticated: Boolean(token),
    loading,
    cierreVoluntario,
    olvidarCierreVoluntario,
    login,
    registrar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
