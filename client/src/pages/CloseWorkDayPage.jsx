import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../components/ui/SectionTitle";
import WorkDaySummaryCard from "../components/WorkDaySummaryCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import { closeWorkDay, getOpenWorkDay } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";

function CloseWorkDayPage() {
  const [openWorkDay, setOpenWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [fuelOwn, setFuelOwn] = useState("0");
  const [endKm, setEndKm] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCloseData();
  }, []);

  const loadCloseData = async () => {
    try {
      const openWorkDayData = await getOpenWorkDay();

      if (!openWorkDayData) {
        navigate("/");
        return;
      }

      const summaryData = await getWorkDaySummary(openWorkDayData.id);

      setOpenWorkDay(openWorkDayData);
      setSummary(summaryData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const workedKm =
    openWorkDay && endKm
      ? Number(endKm) - Number(openWorkDay.startKm)
      : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!endKm) {
      setError("El kilometraje final es obligatorio");
      return;
    }

    if (workedKm < 0) {
      setError("El kilometraje final no puede ser menor al inicial");
      return;
    }

    if (Number(fuelOwn) < 0) {
      setError("El combustible no puede ser negativo");
      return;
    }

    setShowConfirm(true);
  };

  const confirmCloseWorkDay = async () => {
    try {
      setError("");

      await closeWorkDay(openWorkDay.id, {
        endKm,
        fuelOwn,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
      setShowConfirm(false);
    }
  };

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Finalizar jornada"
        subtitle="Revisa la información antes de cerrar el turno."
      />

      <WorkDaySummaryCard summary={summary} />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {openWorkDay && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Kilometraje inicial</p>
              <p className="mt-1 text-xl font-bold text-white">
                {openWorkDay.startKm} km
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="fuelOwn"
              className="mb-2 block text-sm text-slate-300"
            >
              Combustible (€)
            </label>

            <input
              id="fuelOwn"
              name="fuelOwn"
              type="number"
              step="0.01"
              value={fuelOwn}
              onChange={(event) => setFuelOwn(event.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
            />

            <p className="mt-2 text-sm text-slate-400">
              Si hoy no repostaste, deja el valor en 0.
            </p>
          </div>

          <div>
            <label
              htmlFor="endKm"
              className="mb-2 block text-sm text-slate-300"
            >
              Kilometraje final
            </label>

            <input
              id="endKm"
              name="endKm"
              type="number"
              value={endKm}
              onChange={(event) => setEndKm(event.target.value)}
              placeholder="Ej: 64892"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
            />
          </div>

          {workedKm !== null && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-300">
                Kilómetros trabajados
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {workedKm} km
              </p>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit">Confirmar cierre</Button>
        </form>
      </Card>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white">
              ¿Cerrar jornada?
            </h3>

            <p className="mt-3 text-sm text-slate-300">
              Esta acción cerrará el turno y cambiará la jornada a estado
              CLOSED.
            </p>

            <div className="mt-6 space-y-3">
              <Button onClick={confirmCloseWorkDay}>
                Sí, cerrar jornada
              </Button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CloseWorkDayPage;