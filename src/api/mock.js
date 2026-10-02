import { ApiError } from "./client";

// Datos en memoria para trabajar sin backend. Se reinician al recargar la página.
let eventos = [
  {
    id: 1,
    nombre: "Boda de Ana y Luis",
    tipo: "Boda",
    cliente_contacto: "Ana Gómez - 300 123 4567",
    fecha_hora: "2026-11-14T17:00",
    lugar: "Hacienda El Roble",
    plazo_limite: "2026-11-07",
  },
  {
    id: 2,
    nombre: "Cumpleaños de Laura",
    tipo: "Cumpleaños",
    cliente_contacto: "laura@correo.com",
    fecha_hora: "2026-10-20T19:30",
    lugar: "Salón Las Palmas",
    plazo_limite: "2026-10-15",
  },
];

let subtareas = [
  {
    id: 1,
    evento: 1,
    titulo: "Reservar salón",
    descripcion: "Confirmar fecha y pagar anticipo.",
    fecha_objetivo: "2026-10-05",
    horas_estimadas: 2,
    estado: "pendiente",
  },
  {
    id: 2,
    evento: 1,
    titulo: "Confirmar catering",
    descripcion: "Menú para 120 personas.",
    fecha_objetivo: "2026-10-12",
    horas_estimadas: 3,
    estado: "en_progreso",
  },
];

let siguienteEventoId = 3;
let siguienteSubtareaId = 3;

function responder(valor) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(valor)), 300),
  );
}

function noEncontrado() {
  return Promise.reject(new ApiError(404, { detail: "Evento no encontrado." }));
}

function buscarEvento(id) {
  return eventos.find((evento) => evento.id === Number(id));
}

export function listarEventos() {
  return responder(eventos);
}

export function obtenerEvento(id) {
  const evento = buscarEvento(id);
  return evento ? responder(evento) : noEncontrado();
}

export function crearEvento(datos) {
  const evento = { id: siguienteEventoId++, ...datos };
  eventos = [...eventos, evento];
  return responder(evento);
}

export function actualizarEvento(id, datos) {
  const actual = buscarEvento(id);
  if (!actual) return noEncontrado();

  const actualizado = { ...actual, ...datos, id: actual.id };
  eventos = eventos.map((evento) =>
    evento.id === actual.id ? actualizado : evento,
  );
  return responder(actualizado);
}

export function eliminarEvento(id) {
  if (!buscarEvento(id)) return noEncontrado();

  eventos = eventos.filter((evento) => evento.id !== Number(id));
  subtareas = subtareas.filter((subtarea) => subtarea.evento !== Number(id));
  return responder(null);
}

export function listarSubtareas(eventoId) {
  if (!buscarEvento(eventoId)) return noEncontrado();
  return responder(
    subtareas.filter((subtarea) => subtarea.evento === Number(eventoId)),
  );
}

export function crearSubtarea(eventoId, datos) {
  if (!buscarEvento(eventoId)) return noEncontrado();

  const subtarea = {
    id: siguienteSubtareaId++,
    evento: Number(eventoId),
    ...datos,
  };
  subtareas = [...subtareas, subtarea];
  return responder(subtarea);
}

// --- Auth (Sprint 2) ---
// Simulado en memoria: acepta cualquier correo con contraseña >= 6
// caracteres. Como no hay backend real detrás, la "sesión" no sobrevive un
// refresh de página (igual que el resto de datos en modo mock).
let organizadorActual = null;

export function login(email, password) {
  if (!email) {
    return Promise.reject(
      new ApiError(400, { email: ["Este campo es obligatorio."] }),
    );
  }
  if (!password) {
    return Promise.reject(
      new ApiError(400, { password: ["Este campo es obligatorio."] }),
    );
  }
  if (password.length < 6) {
    return Promise.reject(
      new ApiError(400, {
        password: ["La contraseña debe tener al menos 6 caracteres."],
      }),
    );
  }

  organizadorActual = {
    id: "mock-organizador",
    nombre: email.split("@")[0],
    email,
  };

  return responder({
    message: "Login correcto",
    token: "mock-token",
    organizador: organizadorActual,
  });
}

export function obtenerPerfil() {
  if (!organizadorActual) {
    return Promise.reject(new ApiError(401, { detail: "No autenticado." }));
  }
  return responder(organizadorActual);
}
