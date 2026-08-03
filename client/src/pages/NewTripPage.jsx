import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActivePaymentProgress from "../components/ActivePaymentProgress";
import SectionTitle from "../components/ui/SectionTitle";
import QuickTripForm from "../components/QuickTripForm";

import { createTrip } from "../services/tripService";
import { getOpenWorkDay } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getDriverSettings } from "../services/driverSettingsService";
import { isSalariedDriverUser } from "../utils/userNavigation";

function NewTripPage({ currentUser = null }) {
  const navigate = useNavigate();
  const [activeSummary, setActiveSummary] = useState(null);
  const [commissionCompanies, setCommissionCompanies] = useState([]);

  const loadActiveSummary = useCallback(async () => {
    const openWorkDay = await getOpenWorkDay();

    if (!openWorkDay) {
      setActiveSummary(null);
      return;
    }

    setActiveSummary(await getWorkDaySummary(openWorkDay.id));
  }, []);

  useEffect(() => {
    loadActiveSummary().catch((error) => {
      console.error("No se pudo cargar el acumulado de la jornada", error);
    });
  }, [loadActiveSummary]);

  useEffect(() => {
    if (!isSalariedDriverUser(currentUser)) return;
    getDriverSettings()
      .then((data) => setCommissionCompanies(data.companies.filter((item) => item.status === "ACTIVE")))
      .catch((error) => console.error("No se pudieron cargar las empresas", error));
  }, [currentUser]);

  const handleCreateTrip = async (tripData) => {
    const openWorkDay = await getOpenWorkDay();

    if (!openWorkDay) {
      throw new Error("No hay una jornada activa.");
    }

    await createTrip({
      workDayId: openWorkDay.id,
      ...tripData,
    });

    try {
      setActiveSummary(await getWorkDaySummary(openWorkDay.id));
    } catch (error) {
      console.error("El viaje se guardó, pero no se pudo actualizar el acumulado", error);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <SectionTitle
          title="Nuevo viaje"
          subtitle="Ingresá el importe y guardalo como efectivo o datáfono."
        />

        <button
          type="button"
          onClick={() => navigate("/my-work-day")}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
        >
          Ver jornada
        </button>
      </div>

      <ActivePaymentProgress summary={activeSummary} />

      <QuickTripForm onSubmit={handleCreateTrip} commissionCompanies={commissionCompanies} />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate("/my-work-day")}
          className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-4 font-bold text-white transition hover:border-emerald-500/40 hover:bg-slate-700 active:scale-[0.98]"
        >
          ← Ver jornada
        </button>

        <button
          type="button"
          onClick={() => navigate("/close-work-day")}
          className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4 font-bold text-red-300 transition hover:bg-red-500/20 active:scale-[0.98]"
        >
          Cerrar jornada
        </button>
      </div>
    </section>
  );
}

export default NewTripPage;
