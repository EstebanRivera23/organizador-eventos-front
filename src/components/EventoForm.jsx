import { useState } from "react";
import { erroresDeApi } from "../api/client";
import { TIPOS_EVENTO } from "../constants";
import { aInputFecha, aInputFechaHora } from "../utils/fechas";
import { validarEvento } from "../utils/validaciones";
import Campo from "./Campo";

const CAMPOS = [
  "nombre",
  "tipo",
  "cliente_contacto",
  "fecha_hora",
  "lugar",
  "plazo_limite",
];

function valoresIniciales(evento) {
  return {
    nombre: evento?.nombre ?? "",
    tipo: evento?.tipo ?? "",
    cliente_contacto: evento?.cliente_contacto ?? "",
    fecha_hora: aInputFechaHora(evento?.fecha_hora),
    lugar: evento?.lugar ?? "",
    plazo_limite: aInputFecha(evento?.plazo_limite),
  };
}

function EventoForm({ evento, textoBoton, onSubmit, onCancelar }) {
  const [valores, setValores] = useState(() => valoresIniciales(evento));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validarEvento(valores);
    setErrores(nuevosErrores);
    setErrorGeneral("");
    if (Object.keys(nuevosErrores).length > 0) return;

    const datos = Object.fromEntries(
      CAMPOS.map((campo) => [campo, valores[campo].trim()]),
    );

    setEnviando(true);
    try {
      await onSubmit(datos);
    } catch (error) {
      const { campos, general } = erroresDeApi(error, CAMPOS);
      setErrores(campos);
      setErrorGeneral(general);
      setEnviando(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      {errorGeneral && (
        <p className="alert-error" role="alert">
          {errorGeneral}
        </p>
      )}

      <Campo
        label="Nombre del evento"
        name="nombre"
        placeholder="Ejemplo: Boda de Ana y Luis"
        value={valores.nombre}
        onChange={handleChange}
        error={errores.nombre}
      />

      <div className="form-row">
        <Campo
          as="select"
          label="Tipo de evento"
          name="tipo"
          value={valores.tipo}
          onChange={handleChange}
          error={errores.tipo}
        >
          <option value="">Selecciona un tipo</option>
          {TIPOS_EVENTO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </Campo>

        <Campo
          label="Contacto del cliente"
          name="cliente_contacto"
          placeholder="Nombre, teléfono o correo"
          value={valores.cliente_contacto}
          onChange={handleChange}
          error={errores.cliente_contacto}
        />
      </div>

      <div className="form-row">
        <Campo
          type="datetime-local"
          label="Fecha y hora del evento"
          name="fecha_hora"
          value={valores.fecha_hora}
          onChange={handleChange}
          error={errores.fecha_hora}
        />

        <Campo
          type="date"
          label="Fecha límite de preparación"
          name="plazo_limite"
          ayuda="Día en que todo debe estar listo antes del evento."
          value={valores.plazo_limite}
          onChange={handleChange}
          error={errores.plazo_limite}
        />
      </div>

      <Campo
        label="Lugar"
        name="lugar"
        placeholder="Ejemplo: Hacienda El Roble"
        value={valores.lugar}
        onChange={handleChange}
        error={errores.lugar}
      />

      <div className="form-actions">
        {onCancelar && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
        )}
        <button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : textoBoton}
        </button>
      </div>
    </form>
  );
}

export default EventoForm;
