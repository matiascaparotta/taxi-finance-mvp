import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import Stat from "../components/ui/Stat";
import WorkDayCard from "../components/WorkDayCard";
import ActiveTripCard from "../components/ActiveTripCard";

import { getOpenWorkDay, getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";
import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";
import { getClosedWorkDays } from "../utils/getClosedWorkDays";
import { getRecentClosedWorkDays } from "../utils/getRecentClosedWorkDays";
import { sortWorkDaysByDateDescending } from "../utils/sortWorkDaysByDate";

function HomePage() {
  const [workDays, setWorkDays] = useState([]);
  const [openWorkDay, setOpenWorkDay] = useState(null);
  const [activeSummary, setActiveSummary] = useState(null);
  const [activeTrips, setActiveTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadHomeData = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const [workDaysData, openWorkDayData] = await Promise.all([
        getWorkDays(),
        getOpenWorkDay(),
      ]);

      const sortedWorkDays =
        sortWorkDaysByDateDescending(workDaysData);
      const visibleClosedWorkDayIds = new Set(
        getRecentClosedWorkDays(sortedWorkDays).map(
          (workDay) => workDay.id
        )
      );

      const workDaysWithSummary = await Promise.all(
        sortedWorkDays.map(async (workDay) => {
          if (!visibleClosedWorkDayIds.has(workDay.id)) {
            return workDay;
          }

          const summary = await getWorkDaySummary(workDay.id);

          return {
            ...workDay,
            summary,
          };
        })
      );

      setWorkDays(workDaysWithSummary);
      setOpenWorkDay(openWorkDayData);

      if (openWorkDayData) {
        const [summary, trips] = await Promise.all([
          getWorkDaySummary(openWorkDayData.id),
          getTripsByWorkDay(openWorkDayData.id),
        ]);

        setActiveSummary(summary);
        setActiveTrips(trips);
      } else {
        setActiveSummary(null);
        setActiveTrips([]);
      }
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "No se pudo cargar la información del inicio"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const closedWorkDays = getClosedWorkDays(workDays);
  const lastWorkDay = closedWorkDays[0];
  const recentWorkDays = closedWorkDays.slice(1, 5);

  const formatTripTime = (trip) => {
    const rawDate = trip.createdAt || trip.created_at || trip.createdAtFormatted;

    if (!rawDate) {
      return "Hora no disponible";
    }

    return new Date(rawDate).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedActiveTrips = [...activeTrips].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);

    return dateB - dateA;
  });

  if (isLoading) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Hola, Mati 👋"
          subtitle="Bienvenido a Taxi Finance"
        />

        <Card>
          <p className="text-center text-slate-300">
            Cargando inicio...
          </p>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Hola, Mati 👋"
          subtitle="Bienvenido a Taxi Finance"
        />

        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            No pudimos cargar el inicio
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {error}
          </p>
          <button
            type="button"
            onClick={loadHomeData}
            className="mt-5 w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
          >
            Reintentar
          </button>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Hola, Mati 👋"
        subtitle="Bienvenido a Taxi Finance"
      />

      {openWorkDay ? (
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <p className="text-sm font-medium text-emerald-300">
            Jornada activa
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Turno iniciado
          </h2>

          <p className="mt-2 text-slate-300">
            Km inicial: <strong>{openWorkDay.startKm}</strong>
          </p>

          {activeSummary && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Stat label="🚖 Viajes" value={activeSummary.tripCount} />

              <Stat
                label="💶 Facturación"
                value={formatCurrency(activeSummary.totalRevenue)}
              />

              <Stat
                label="💵 Efectivo"
                value={formatCurrency(getDisplayedCash(activeSummary))}
              />

              <Stat
                label="💳 Datáfono"
                value={formatCurrency(activeSummary.card)}
              />
            </div>
          )}

          <div className="mt-6">
            <Button onClick={() => navigate("/new-trip")}>
              Registrar viaje
            </Button>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => navigate("/close-work-day")}
              className="w-full rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-4 text-lg font-bold text-red-300 transition hover:bg-red-500/20 active:scale-[0.99]"
            >
              Finalizar jornada
            </button>
          </div>

          <div className="mt-6 border-t border-emerald-500/20 pt-5">
            <div>
              <h3 className="text-lg font-bold text-white">
                Últimos viajes
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Registro rápido de la jornada activa
              </p>
            </div>

            {sortedActiveTrips.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                Todavía no registraste viajes en esta jornada.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {sortedActiveTrips.map((trip) => (
                  <ActiveTripCard
                    key={trip.id}
                    trip={trip}
                    time={formatTripTime(trip)}
                    onClick={() => navigate(`/trips/${trip.id}/edit`)}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <p className="text-sm font-medium text-emerald-300">
            Acción principal
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Iniciar jornada
          </h2>

          <p className="mt-2 text-slate-300">
            Registra el kilometraje inicial y empieza tu turno.
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/new-work-day")}>
              Iniciar jornada
            </Button>
          </div>
        </Card>
      )}

      {lastWorkDay && (
        <section className="space-y-3">
          <SectionTitle
            title="Última jornada"
            subtitle="Tu último turno registrado"
          />

          <WorkDayCard workDay={lastWorkDay} />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <SectionTitle
            title="Jornadas recientes"
            subtitle="Historial de tus últimos turnos"
          />

          <button
            type="button"
            onClick={() => navigate("/history")}
            className="mt-1 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Ver historial
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recentWorkDays.map((workDay) => (
            <WorkDayCard key={workDay.id} workDay={workDay} />
          ))}
        </div>
      </section>
    </section>
  );
}

export default HomePage;
