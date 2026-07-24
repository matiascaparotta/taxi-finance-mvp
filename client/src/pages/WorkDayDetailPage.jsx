import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";

import WorkDayShareCard from "../components/WorkDayShareCard";
import WorkDayTicket from "../components/WorkDayTicket";

import { getWorkDayById } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";

import { formatDate } from "../utils/formatDate";
import { buildWorkDaySummaryText } from "../utils/buildWorkDaySummaryText";
import { copyTextToClipboard } from "../utils/copyTextToClipboard";

function WorkDayDetailPage() {
  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const loadWorkDayDetail = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    loadWorkDayDetail();
  }, [loadWorkDayDetail]);

  const handleCopySummary = async () => {
    if (!workDay || !summary) {
      return;
    }

    const text = buildWorkDaySummaryText(workDay, summary);

    await copyTextToClipboard(text);

    setCopyMessage("Resumen copiado");

    setTimeout(() => {
      setCopyMessage("");
    }, 2500);
  };

  if (isLoading) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Detalle de jornada"
          subtitle="Cargando información..."
        />
        <Card>
          <p className="text-center text-slate-300">
            Cargando jornada...
          </p>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Detalle de jornada"
          subtitle="No pudimos cargar la información."
        />
        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            No se pudo cargar la jornada
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {error}
          </p>
          <div className="mt-5 space-y-3">
            <Button onClick={loadWorkDayDetail}>
              Reintentar
            </Button>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-[0.99]"
            >
              Volver al historial
            </button>
          </div>
        </Card>
      </section>
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
        <WorkDayTicket
          workDay={workDay}
          summary={summary}
          trips={trips}
        />

        <WorkDayShareCard
          workDay={workDay}
          summary={summary}
          trips={trips}
        />

        <button
          type="button"
          onClick={handleCopySummary}
          className="w-full rounded-2xl border border-emerald-500/40 px-6 py-4 text-lg font-bold text-emerald-300 transition hover:bg-emerald-500/10 active:scale-[0.99]"
        >
          Copiar resumen para WhatsApp
        </button>

        {copyMessage && (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            {copyMessage}
          </p>
        )}
      </div>

      <Button onClick={() => navigate("/history")}>
        Volver al historial
      </Button>
    </section>
  );
}

export default WorkDayDetailPage;
