import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";

import {
  createWorkDay,
  getLatestClosedWorkDay,
} from "../services/workDayService";

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultWorkDayDate() {
  const now = new Date();
  const workDayDate = new Date(now);

  if (now.getHours() < 6) {
    workDayDate.setDate(workDayDate.getDate() - 1);
  }

  return formatDateForInput(workDayDate);
}

function NewWorkDayPage() {
  const [startKm, setStartKm] = useState("");
  const [latestClosedWorkDay, setLatestClosedWorkDay] = useState(null);
  const [error, setError] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const startingLockRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadLatestMileage = async () => {
      try {
        const workDay = await getLatestClosedWorkDay();
        setLatestClosedWorkDay(workDay);
      } catch (error) {
        setError(error.message);
      }
    };

    loadLatestMileage();
  }, []);

  const startWorkDay = async (resetOdometer = false) => {
    if (startingLockRef.current) {
      return;
    }

    startingLockRef.current = true;
    setIsStarting(true);

    try {
      await createWorkDay({
        date: getDefaultWorkDayDate(),
        startKm,
        resetOdometer,
      });

      navigate("/");
    } finally {
      startingLockRef.current = false;
      setIsStarting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (startKm === "") {
        setError("El kilometraje inicial es obligatorio");
        return;
      }

      if (
        latestClosedWorkDay?.endKm !== null &&
        latestClosedWorkDay?.endKm !== undefined &&
        Number(startKm) < Number(latestClosedWorkDay.endKm)
      ) {
        setShowResetConfirm(true);
        return;
      }

      await startWorkDay();
    } catch (error) {
      setError(error.message);
    }
  };

  const confirmNewMileageBase = async () => {
    try {
      setError("");
      await startWorkDay(true);
    } catch (error) {
      setError(error.message);
      setShowResetConfirm(false);
    }
  };

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Nueva jornada"
        subtitle="Comienza tu turno registrando el kilometraje inicial."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="startKm"
              className="mb-2 block text-sm text-slate-300"
            >
              Kilometraje inicial
            </label>

            <input
              id="startKm"
              name="startKm"
              type="number"
              value={startKm}
              onChange={(event) => setStartKm(event.target.value)}
              placeholder="Ej: 64220"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg outline-none focus:border-emerald-500"
            />

            {latestClosedWorkDay?.endKm !== null &&
              latestClosedWorkDay?.endKm !== undefined && (
                <p className="mt-2 text-xs text-slate-400">
                  Último kilometraje registrado:{" "}
                  {latestClosedWorkDay.endKm} km
                </p>
              )}
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isStarting}
            className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-bold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
          >
            {isStarting ? "Iniciando..." : "Iniciar jornada"}
          </button>
        </form>
      </Card>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-amber-500/30 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white">
              ¿Usar un nuevo kilometraje base?
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              Introdujiste {startKm} km, por debajo de los{" "}
              {latestClosedWorkDay?.endKm} km registrados. Confirma solamente
              si cambiaste de vehículo o se reinició el cuentakilómetros.
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={confirmNewMileageBase}
                disabled={isStarting}
                className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-bold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
              >
                {isStarting
                  ? "Iniciando..."
                  : "Sí, usar nueva base"}
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={isStarting}
                className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Corregir kilometraje
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default NewWorkDayPage;
