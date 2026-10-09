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
  const idError = `${name}-error`;
  const idAyuda = `${name}-ayuda`;
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
