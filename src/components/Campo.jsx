// Etiqueta + control + mensaje de error, con los atributos de accesibilidad
// conectados. `as` puede ser "input", "select" o "textarea".
function Campo({ label, name, error, as: Control = "input", children, ...props }) {
  const idError = `${name}-error`;

  return (
    <label>
      {label}
      <Control
        name={name}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? idError : undefined}
        {...props}
      >
        {children}
      </Control>
      {error && (
        <span className="field-error" id={idError}>
          {error}
        </span>
      )}
    </label>
  );
}

export default Campo;
