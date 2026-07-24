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
import { buildWorkDaySummaryText } from "../utils/buildWorkDaySummaryText";
import { copyTextToClipboard } from "../utils/copyTextToClipboard";

function WorkDayClosedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const [workDayData, summaryData, tripsData] = await Promise.all([
        getWorkDayById(id),
        getWorkDaySummary(id),
        getTripsByWorkDay(id),
      ]);

      setWorkDay(workDayData);
      setSummary(summaryData);
      setTrips(tripsData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyText = async () => {
    try {
      const text = buildWorkDaySummaryText(workDay, summary);
      await copyTextToClipboard(text);
      setCopyMessage("Resumen copiado");

      setTimeout(() => {
        setCopyMessage("");
      }, 2500);
    } catch (error) {
      setCopyMessage(error.message);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Jornada cerrada"
          subtitle="Preparando el resumen final."
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
          title="Jornada cerrada"
          subtitle="No pudimos preparar el resumen."
        />
        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            No se pudo cargar la jornada
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {error}
          </p>
          <div className="mt-5 space-y-3">
            <Button onClick={loadData}>
              Reintentar
            </Button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-[0.99]"
            >
              Volver al inicio
            </button>
          </div>
        </Card>
      </section>
    );
  }

  if (!workDay || !summary) {
    return null;
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Jornada cerrada"
        subtitle="Resumen final del turno."
      />

      <WorkDayTicket workDay={workDay} summary={summary} trips={trips} />

      <WorkDayShareCard
        workDay={workDay}
        summary={summary}
        trips={trips}
      />

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleCopyText}
          className="w-full rounded-2xl border border-emerald-500/40 px-6 py-4 text-lg font-bold text-emerald-300 transition hover:bg-emerald-500/10 active:scale-[0.99]"
        >
          Copiar texto
        </button>

        {copyMessage && (
          <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
            {copyMessage}
          </p>
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}

export default WorkDayClosedPage;
