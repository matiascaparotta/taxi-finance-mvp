import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import WorkDayTicket from "../components/WorkDayTicket";

import { getWorkDayById } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";

function WorkDayClosedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workDayData, summaryData] = await Promise.all([
        getWorkDayById(id),
        getWorkDaySummary(id),
      ]);

      setWorkDay(workDayData);
      setSummary(summaryData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
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

      <WorkDayTicket
        workDay={workDay}
        summary={summary}
      />

      <div className="space-y-3">
        <Button>
          Compartir resumen
        </Button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}

export default WorkDayClosedPage;