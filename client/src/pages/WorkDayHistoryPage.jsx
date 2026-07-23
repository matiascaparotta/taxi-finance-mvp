import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import HistoryWorkDayCard from "../components/HistoryWorkDayCard";

import { getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";

function WorkDayHistoryPage() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setError("");
      setIsLoading(true);

      const workDays = await getWorkDays();

      const closedWorkDays = workDays
        .filter((workDay) => workDay.status === "CLOSED")
        .sort((a, b) => {
          const idA = Number(a.id || 0);
          const idB = Number(b.id || 0);

          return idB - idA;
        });

      const historyWithSummary = await Promise.all(
        closedWorkDays.map(async (workDay) => {
          const summary = await getWorkDaySummary(workDay.id);

          return {
            ...workDay,
            summary,
          };
        })
      );

      setHistory(historyWithSummary);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-slate-400">Cargando historial...</p>;
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle
          title="Historial"
          subtitle="Consulta tus jornadas anteriores."
        />

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-1 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
        >
          Inicio
        </button>
      </div>

      {history.length === 0 ? (
        <Card>
          <p className="text-slate-300">
            Todavía no hay jornadas cerradas para mostrar.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((workDay) => (
            <HistoryWorkDayCard
              key={workDay.id}
              workDay={workDay}
              onClick={() => navigate(`/work-days/${workDay.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default WorkDayHistoryPage;
