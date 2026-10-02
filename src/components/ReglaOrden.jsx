// Explica en palabras sencillas el orden de la vista Hoy. Tiene que decir
// exactamente lo que hace el backend en GET /api/subtareas/hoy/: grupos por
// fecha objetivo y, dentro de cada uno, fecha y luego menos horas.
function ReglaOrden() {
  return (
    <aside className="regla-orden" aria-labelledby="regla-orden-titulo">
      <h2 id="regla-orden-titulo">¿Cómo se ordenan tus gestiones?</h2>
      <ol>
        <li>
          Primero van las <strong>vencidas</strong>, después las de{" "}
          <strong>hoy</strong> y al final las <strong>próximas</strong>.
        </li>
        <li>
          Dentro de cada grupo aparecen por fecha objetivo, de la más antigua
          a la más lejana.
        </li>
        <li>
          Si dos tienen la misma fecha, va primero la que te toma menos horas.
        </li>
      </ol>
    </aside>
  );
}

export default ReglaOrden;
