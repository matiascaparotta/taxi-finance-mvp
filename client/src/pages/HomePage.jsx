import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import WorkDayCard from "../components/WorkDayCard";
import OwnerActiveWorkDays from "../components/OwnerActiveWorkDays";
import { getOpenWorkDay, getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getClosedWorkDays } from "../utils/getClosedWorkDays";
import { sortWorkDaysByDateDescending } from "../utils/sortWorkDaysByDate";

function HomePage({ currentUser = null }) {
  const [openWorkDay, setOpenWorkDay] = useState(null);
  const [closedWorkDays, setClosedWorkDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const firstName =
    currentUser?.displayName?.trim().split(/\s+/)[0] || "Mati";
  const isOwner = Boolean(
    currentUser?.roles?.isOwner ?? currentUser?.isOwner
  );

  const loadHome = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);
      const [workDays, activeWorkDay] = await Promise.all([
        getWorkDays(),
        getOpenWorkDay(),
      ]);
      const personalClosed = getClosedWorkDays(
        sortWorkDaysByDateDescending(workDays).filter(
          (workDay) => workDay.canManage !== false
        )
      ).slice(0, 5);
      const withSummaries = await Promise.all(
        personalClosed.map(async (workDay) => ({
          ...workDay,
          summary: await getWorkDaySummary(workDay.id),
        }))
      );

      setOpenWorkDay(activeWorkDay);
      setClosedWorkDays(withSummaries);
    } catch (loadError) {
      setError(loadError.message || "No se pudo cargar el inicio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  return (
    <section className="space-y-8">
      <SectionTitle
        title={`Hola, ${firstName} 👋`}
        subtitle="Resumen de tu actividad en TaxFin"
      />

      {isOwner && <OwnerActiveWorkDays currentUser={currentUser} />}

      {error ? (
        <Card className="border-red-500/30">
          <p className="font-bold text-white">No pudimos cargar el inicio</p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
          <button
            type="button"
            onClick={loadHome}
            className="mt-5 w-full rounded-xl border border-slate-700 px-4 py-3 font-bold text-slate-200"
          >
            Reintentar
          </button>
        </Card>
      ) : (
        <Card className={openWorkDay ? "border-emerald-500/30" : ""}>
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">
            MI ACTIVIDAD
          </p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {isLoading
                  ? "Comprobando jornada..."
                  : openWorkDay
                    ? "Jornada en curso"
                    : "Sin jornada activa"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {openWorkDay
                  ? `Km inicial: ${openWorkDay.startKm}`
                  : "Todo listo para comenzar tu próximo turno."}
              </p>
            </div>
            {openWorkDay && (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                En curso
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate("/my-work-day")}
            disabled={isLoading}
            className="mt-5 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
          >
            Ir a mi jornada →
          </button>
        </Card>
      )}

      {!isOwner && closedWorkDays[0] && (
        <section className="space-y-3">
          <SectionTitle
            title="Última jornada"
            subtitle="Tu último turno registrado"
          />
          <WorkDayCard workDay={closedWorkDays[0]} />
        </section>
      )}

      {!isOwner && <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle
            title="Actividad reciente"
            subtitle="Una vista breve de tus jornadas"
          />
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300"
          >
            Historial
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {closedWorkDays.slice(1).map((workDay) => (
            <WorkDayCard key={workDay.id} workDay={workDay} />
          ))}
        </div>
      </section>}
    </section>
  );
}

export default HomePage;
