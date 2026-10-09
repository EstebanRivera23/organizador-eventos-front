// Cuenta en pocas palabras en qué orden sale la lista de Hoy. Tiene que
// decir lo que se ve: el orden de los grupos lo pone Hoy.jsx y, dentro de
// cada uno, el backend ordena por fecha y luego por menos horas.
function ReglaOrden() {
  return (
    <aside className="regla-orden" aria-labelledby="regla-orden-titulo">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h10M4 12h7M4 18h4M17 5v14M14 16l3 3 3-3" />
      </svg>
      <p>
        <strong id="regla-orden-titulo">Lo más urgente va arriba.</strong>{" "}
        Primero lo vencido, después lo de hoy y al final lo que viene. En cada
        grupo van por fecha y, si dos coinciden, primero la que te toma menos
        horas.
      </p>
    </aside>
  );
}

export default ReglaOrden;
