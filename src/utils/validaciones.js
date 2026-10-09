import { LIMITE_DIARIO } from "../constants";

const estaVacio = (valor) => String(valor ?? "").trim() === "";

export function validarEvento(valores) {
  const errores = {};

  if (estaVacio(valores.nombre)) {
    errores.nombre = "El nombre del evento es obligatorio.";
  }
  if (estaVacio(valores.tipo)) {
    errores.tipo = "Selecciona el tipo de evento.";
  }
  if (estaVacio(valores.cliente_contacto)) {
    errores.cliente_contacto = "El contacto del cliente es obligatorio.";
  }
  if (estaVacio(valores.fecha_hora)) {
    errores.fecha_hora = "Indica la fecha y hora del evento.";
  }
  if (estaVacio(valores.lugar)) {
    errores.lugar = "El lugar del evento es obligatorio.";
  }
  if (estaVacio(valores.plazo_limite)) {
    errores.plazo_limite = "Indica el plazo límite.";
  }

  return errores;
}

export function validarSubtarea(valores) {
  const errores = {};

  if (estaVacio(valores.titulo)) {
    errores.titulo = "El título de la subtarea es obligatorio.";
  }
  if (estaVacio(valores.fecha_objetivo)) {
    errores.fecha_objetivo = "Indica la fecha objetivo.";
  }
  if (estaVacio(valores.horas_estimadas)) {
    errores.horas_estimadas = "Indica las horas estimadas.";
  } else if (!(Number(valores.horas_estimadas) > 0)) {
    errores.horas_estimadas = "Las horas estimadas deben ser mayores a 0.";
  }
  if (estaVacio(valores.estado)) {
    errores.estado = "Selecciona el estado de la subtarea.";
  }

  return errores;
}

// Devuelve el mensaje de error, o "" si el límite es válido.
export function validarLimiteDiario(valor) {
  if (estaVacio(valor)) {
    return "Escribe cuántas horas por día quieres como límite.";
  }

  const horas = Number(valor);
  if (
    Number.isNaN(horas) ||
    horas < LIMITE_DIARIO.minimo ||
    horas > LIMITE_DIARIO.maximo
  ) {
    return `El límite debe estar entre ${LIMITE_DIARIO.minimo} y ${LIMITE_DIARIO.maximo} horas por día.`;
  }

  return "";
}

export function validarRegistro(valores) {
  const errores = {};

  if (estaVacio(valores.nombre)) {
    errores.nombre = "Escribe tu nombre.";
  }
  if (estaVacio(valores.email)) {
    errores.email = "Escribe tu correo.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim())) {
    errores.email = "Escribe un correo válido, por ejemplo ana@correo.com.";
  }
  if (String(valores.password ?? "").length < 6) {
    errores.password = "La contraseña debe tener al menos 6 caracteres.";
  }
  if (estaVacio(valores.confirmacion)) {
    errores.confirmacion = "Escribe la contraseña otra vez.";
  } else if (valores.confirmacion !== valores.password) {
    errores.confirmacion = "Las contraseñas no coinciden.";
  }

  return errores;
}
