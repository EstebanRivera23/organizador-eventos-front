// Las horas se muestran igual en toda la app: sin ceros de más y con punto
// decimal. "1.00" -> "1", "1.50" -> "1.5".
export function numeroDeHoras(horas) {
  return String(Number(Number(horas).toFixed(2)));
}

// "1.00" -> "1 h", "1.50" -> "1.5 h"
export function enHoras(horas) {
  return `${numeroDeHoras(horas)} h`;
}
