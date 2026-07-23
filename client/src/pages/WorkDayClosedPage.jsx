import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import SectionTitle from "../components/ui/SectionTitle";
import WorkDayTicket from "../components/WorkDayTicket";

import { getWorkDayById } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";
import { buildWorkDaySummaryText } from "../utils/buildWorkDaySummaryText";

function WorkDayClosedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
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
  };

  const handleShare = async () => {
    if (!workDay || !summary) {
      return;
    }

    try {
      const text = buildWorkDaySummaryText(workDay, summary);

      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("No se pudo copiar el resumen");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-slate-400">
        Cargando jornada...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-400">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Jornada cerrada"
        subtitle="Resumen final del turno."
      />

      <WorkDayTicket workDay={workDay} summary={summary} trips={trips} />

      <div className="space-y-3">
        <Button onClick={handleShare}>
          Compartir resumen
        </Button>

        {copied && (
          <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
            Resumen copiado ✅
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
