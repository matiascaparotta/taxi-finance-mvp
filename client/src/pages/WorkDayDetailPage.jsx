import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";

import WorkDayTicket from "../components/WorkDayTicket";

import { getWorkDayById } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";

import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { buildWorkDaySummaryText } from "../utils/buildWorkDaySummaryText";

function WorkDayDetailPage() {
  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkDayDetail();
  }, [id]);

  const loadWorkDayDetail = async () => {
    try {
      setError("");
      setIsLoading(true);

      const [workDayData, summaryData, tripsData] = await Promise.all([
        getWorkDayById(id),
        getWorkDaySummary(id),
        getTripsByWorkDay(id),
      ]);

      setWorkDay(workDayData);
      setSummary(summaryData);
      setTrips(tripsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = async () => {
    if (!workDay || !summary) {
      return;
    }

    const text = buildWorkDaySummaryText(workDay, summary);

    await navigator.clipboard.writeText(text);

    setCopyMessage("Resumen copiado");

    setTimeout(() => {
      setCopyMessage("");
    }, 2500);
  };

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

  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);

    return dateA - dateB;
  });

  if (isLoading) {
    return <p className="text-slate-400">Cargando jornada...</p>;
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
        {error}
      </p>
    );
  }

  if (!workDay || !summary) {
    return (
      <p className="text-slate-400">
        No se encontró la jornada solicitada.
      </p>
    );
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Detalle de jornada"
        subtitle={formatDate(workDay.date)}
      />
      <div className="space-y-3">
        <WorkDayTicket workDay={workDay} summary={summary} />

        <Button onClick={handleCopySummary}>
          Copiar resumen para WhatsApp
        </Button>

        {copyMessage && (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            {copyMessage}
          </p>
        )}
      </div>

      <section className="space-y-3">
        <SectionTitle
          title="Viajes"
          subtitle="Todos los viajes registrados en esta jornada"
        />

        {sortedTrips.length === 0 ? (
          <Card>
            <p className="text-slate-300">
              Esta jornada no tiene viajes registrados.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedTrips.map((trip) => (
              <button
                key={trip.id}
                type="button"
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-left transition hover:border-emerald-500/40 hover:bg-slate-900 active:scale-[0.99]"
              >
                <p className="text-sm text-slate-400">
                  🕙 {formatTripTime(trip)} ·{" "}
                  {trip.paymentType === "cash"
                    ? "💵 Efectivo"
                    : "💳 Datáfono"}
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {formatCurrency(trip.amount)}
                </p>

                {trip.note && (
                  <p className="mt-1 text-sm text-slate-400">
                    {trip.note}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      <Button onClick={() => navigate("/history")}>
        Volver al historial
      </Button>
    </section>
  );
}

export default WorkDayDetailPage;