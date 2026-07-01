import { useNavigate } from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import TripForm from "../components/TripForm";

import { createTrip } from "../services/tripService";
import { getOpenWorkDay } from "../services/workDayService";

function NewTripPage() {
  const navigate = useNavigate();

  const handleCreateTrip = async (tripData) => {
    const openWorkDay = await getOpenWorkDay();

    if (!openWorkDay) {
      throw new Error("No hay una jornada activa.");
    }

    await createTrip({
      workDayId: openWorkDay.id,
      ...tripData,
    });

    navigate("/");
  };

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Nuevo viaje"
        subtitle="Registra el importe y el método de pago."
      />

      <TripForm
        submitLabel="Guardar viaje"
        loadingLabel="Guardando..."
        onSubmit={handleCreateTrip}
      />
    </section>
  );
}

export default NewTripPage;