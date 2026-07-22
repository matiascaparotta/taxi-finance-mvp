import { useNavigate } from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import QuickTripForm from "../components/QuickTripForm";

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
        subtitle="Ingresá el importe y guardalo directamente como efectivo o datáfono."
      />

      <QuickTripForm onSubmit={handleCreateTrip} />
    </section>
  );
}

export default NewTripPage;