import { useId } from "react";

// Etiqueta + control + mensaje de error, con los atributos de accesibilidad
// conectados. `as` puede ser "input", "select" o "textarea". `ayuda` es un
// texto opcional que explica qué se espera en el campo.
function Campo({
  label,
  name,
  error,
  ayuda,
  as: Control = "input",
  children,
  ...props
}) {
  // Con useId los ids no se repiten aunque haya dos formularios con los
  // mismos campos en la página (agregar y editar una subtarea).
  const id = useId();
  const idError = `${id}-${name}-error`;
  const idAyuda = `${id}-${name}-ayuda`;
  const descritoPor =
    [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") || undefined;

  return (
    <label>
      {label}
      <Control
        name={name}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={descritoPor}
        {...props}
      >
        {children}
      </Control>
      {ayuda && (
        <span className="field-help" id={idAyuda}>
          {ayuda}
        </span>
      )}
      {error && (
        <span className="field-error" id={idError}>
          {error}
        </span>
      )}
    </label>
  );
}

export default Campo;
