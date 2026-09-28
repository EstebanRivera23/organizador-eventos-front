import { useNavigate } from "react-router-dom";
import { crearEvento } from "../api/eventos";
import EventoForm from "../components/EventoForm";
import Layout from "../components/Layout";

function CrearEvento() {
  const navigate = useNavigate();

  async function handleSubmit(datos) {
    const evento = await crearEvento({ ...datos, estado: "pendiente" });
    navigate(`/evento/${evento.id}`, {
      state: { mensaje: "Evento creado correctamente." },
    });
  }

  return (
    <Layout>
      <section className="content-card">
        <p className="eyebrow">Nuevo evento</p>
        <h2>Crear evento</h2>
        <p>Registra los datos principales del evento. Todos son obligatorios.</p>

        <EventoForm textoBoton="Guardar evento" onSubmit={handleSubmit} />
      </section>
    </Layout>
  );
}

export default CrearEvento;
