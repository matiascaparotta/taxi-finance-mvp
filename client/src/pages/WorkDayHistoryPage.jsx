import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import HistoryWorkDayCard from "../components/HistoryWorkDayCard";

import { getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getClosedWorkDays } from "../utils/getClosedWorkDays";
import { sortWorkDaysByDateDescending } from "../utils/sortWorkDaysByDate";
import {
  filterWorkDaysByMonth,
  formatWorkDayMonth,
  getAvailableWorkDayMonths,
} from "../utils/workDayMonth";

function WorkDayHistoryPage() {
  const [history, setHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
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

      const closedWorkDays = sortWorkDaysByDateDescending(
        getClosedWorkDays(workDays)
      );

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
      setSelectedMonth(
        getAvailableWorkDayMonths(historyWithSummary)[0] ?? ""
      );
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

  const availableMonths = getAvailableWorkDayMonths(history);
  const filteredHistory = filterWorkDaysByMonth(
    history,
    selectedMonth
  );

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
        <>
          <Card>
            <label
              htmlFor="historyMonth"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Mes de las jornadas
            </label>
            <select
              id="historyMonth"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg font-bold text-white outline-none focus:border-emerald-500"
            >
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {formatWorkDayMonth(month)}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-slate-400">
              {filteredHistory.length}{" "}
              {filteredHistory.length === 1 ? "jornada" : "jornadas"}
            </p>
          </Card>

          <div className="space-y-4">
            {filteredHistory.map((workDay) => (
              <HistoryWorkDayCard
                key={workDay.id}
                workDay={workDay}
                onClick={() => navigate(`/work-days/${workDay.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default WorkDayHistoryPage;
