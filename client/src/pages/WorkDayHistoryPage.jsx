import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";

import { getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

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
          {history.map((workDay) => {
            const workedKm =
              Number(workDay.endKm || 0) - Number(workDay.startKm || 0);

            return (
              <button
                key={workDay.id}
                type="button"
                onClick={() => navigate(`/work-days/${workDay.id}`)}
                className="w-full text-left"
              >
                <Card className="transition hover:border-emerald-500/40 hover:bg-slate-900 active:scale-[0.99]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-emerald-300">
                        {formatDate(workDay.date)}
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-white">
                        {formatCurrency(workDay.summary.totalRevenue)}
                      </h3>
                    </div>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                      {workedKm} km
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Viajes</p>
                      <p className="font-bold text-white">
                        {workDay.summary.tripCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Combustible</p>
                      <p className="font-bold text-white">
                        {formatCurrency(workDay.fuelOwn)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Efectivo</p>
                      <p className="font-bold text-white">
                        {formatCurrency(workDay.summary.cash)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Datáfono</p>
                      <p className="font-bold text-white">
                        {formatCurrency(workDay.summary.card)}
                      </p>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default WorkDayHistoryPage;