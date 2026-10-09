import logo from "../assets/brand/logo-eventflow.svg";

// Marco de las pantallas de entrada (iniciar sesión y crear cuenta): la marca
// arriba a la izquierda, la frase y la tarjeta con el formulario.
function PortadaAcceso({ larga = false, children }) {
  return (
    <main className={larga ? "login-page login-page-larga" : "login-page"}>
      <header className="login-brand">
        <img src={logo} alt="" width="40" height="40" />
        <div>
          <span className="login-brand-name">
            Event<span>Flow</span>
          </span>
          <h1>Organizador de Eventos Independientes</h1>
        </div>
      </header>

      <p className="login-lema">
        Organiza <span aria-hidden="true">·</span> Prioriza{" "}
        <span aria-hidden="true">·</span> Cumple
      </p>

      <section className="login-card">{children}</section>
    </main>
  );
}

export default PortadaAcceso;
