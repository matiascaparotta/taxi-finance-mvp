import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import Stat from "../components/ui/Stat";
import WorkDayCard from "../components/WorkDayCard";
import { getOpenWorkDay, getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";
function HomePage() {
  const [workDays, setWorkDays] = useState([]);
  const [openWorkDay, setOpenWorkDay] = useState(null);
  const [activeSummary, setActiveSummary] = useState(null);
  const [activeTrips, setActiveTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [workDaysData, openWorkDayData] = await Promise.all([
        getWorkDays(),
        getOpenWorkDay(),
      ]);

      setWorkDays(workDaysData);
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
    }
  };

  const lastWorkDay = workDays[0];

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
                value={`${activeSummary.totalRevenue} €`}
              />
              <Stat label="💵 Efectivo" value={`${activeSummary.cash} €`} />
              <Stat label="💳 Datáfono" value={`${activeSummary.card} €`} />
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
                  <div
                    key={trip.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                  >
                    <p className="text-sm text-slate-400">
                      🕙 {formatTripTime(trip)} · {trip.paymentType === "cash" ? "💵 Efectivo" : "💳 Datáfono"}
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {Number(trip.amount).toFixed(2)} €
                    </p>
                  </div>
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
        <SectionTitle
          title="Jornadas recientes"
          subtitle="Historial de tus últimos turnos"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {workDays.map((workDay) => (
            <WorkDayCard key={workDay.id} workDay={workDay} />
          ))}
        </div>
      </section>
    </section>
  );
}

export default HomePage;