import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import SectionTitle from "../components/ui/SectionTitle";

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

    await copyTextToClipboard(text);

    setCopyMessage("Resumen copiado");

    setTimeout(() => {
      setCopyMessage("");
    }, 2500);
  };

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
        <WorkDayTicket
          workDay={workDay}
          summary={summary}
          trips={trips}
        />

        <Button onClick={handleCopySummary}>
          Copiar resumen para WhatsApp
        </Button>

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
