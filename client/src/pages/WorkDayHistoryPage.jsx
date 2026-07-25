import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import HistoryWorkDayCard from "../components/HistoryWorkDayCard";

import { getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getClosedWorkDays } from "../utils/getClosedWorkDays";
import { sortWorkDaysByDateDescending } from "../utils/sortWorkDaysByDate";
import {
  filterWorkDaysByDate,
  filterWorkDaysByMonth,
  formatWorkDayMonth,
  getAvailableWorkDayMonths,
} from "../utils/workDayMonth";

function WorkDayHistoryPage({ currentUser }) {
  const isOwner = Boolean(
    currentUser?.roles?.isOwner ?? currentUser?.isOwner
  );
  const [history, setHistory] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDriver, setSelectedDriver] = useState(
    searchParams.get("driver") ||
      (isOwner ? String(currentUser?.id || "") : "")
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showDaySearch, setShowDaySearch] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [summariesById, setSummariesById] = useState({});
  const [summaryError, setSummaryError] = useState("");
  const [isLoadingSummaries, setIsLoadingSummaries] =
    useState(false);
  const [summaryReloadKey, setSummaryReloadKey] = useState(0);

  const navigate = useNavigate();

  const loadHistory = useCallback(async () => {
    try {
      setError("");
      setSummaryError("");
      setIsLoading(true);

      const workDays = await getWorkDays();

      const closedWorkDays = sortWorkDaysByDateDescending(
        getClosedWorkDays(workDays)
      );

      setHistory(closedWorkDays);
      setSummariesById({});
      setSelectedDate("");
      setShowDaySearch(false);
      setSelectedMonth(
        getAvailableWorkDayMonths(closedWorkDays)[0] ?? ""
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const visibleWorkDays = useMemo(() => {
    const dateFilteredWorkDays = selectedDate
      ? filterWorkDaysByDate(history, selectedDate)
      : filterWorkDaysByMonth(history, selectedMonth);

    if (!isOwner) {
      return dateFilteredWorkDays;
    }

    return dateFilteredWorkDays.filter(
      (workDay) =>
        String(workDay.driverUserId) === String(selectedDriver)
    );
  }, [
    history,
    isOwner,
    selectedDate,
    selectedDriver,
    selectedMonth,
  ]);

  useEffect(() => {
    let isCancelled = false;
    const workDaysWithoutSummary = visibleWorkDays.filter(
      (workDay) => !summariesById[workDay.id]
    );

    if (workDaysWithoutSummary.length === 0) {
      setIsLoadingSummaries(false);
      setSummaryError("");
      return undefined;
    }

    const loadVisibleSummaries = async () => {
      try {
        setSummaryError("");
        setIsLoadingSummaries(true);

        const loadedSummaries = await Promise.all(
          workDaysWithoutSummary.map(async (workDay) => ({
            id: workDay.id,
            summary: await getWorkDaySummary(workDay.id),
          }))
        );

        if (isCancelled) {
          return;
        }

        setSummariesById((current) => {
          const next = { ...current };

          loadedSummaries.forEach(({ id, summary }) => {
            next[id] = summary;
          });

          return next;
        });
      } catch (error) {
        if (!isCancelled) {
          setSummaryError(error.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSummaries(false);
        }
      }
    };

    loadVisibleSummaries();

    return () => {
      isCancelled = true;
    };
  }, [
    selectedDate,
    selectedMonth,
    summariesById,
    summaryReloadKey,
    visibleWorkDays,
  ]);

  if (isLoading) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Historial"
          subtitle="Consulta tus jornadas anteriores."
        />
        <Card>
          <p className="text-center text-slate-300">
            Cargando historial...
          </p>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Historial"
          subtitle="No pudimos cargar tus jornadas."
        />

        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            Revisa la conexión e inténtalo de nuevo
          </p>
          <p className="mt-2 text-sm text-red-300">{error}</p>

          <div className="mt-5 space-y-3">
            <Button onClick={loadHistory}>Reintentar</Button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
            >
              Volver al inicio
            </button>
          </div>
        </Card>
      </section>
    );
  }

  const availableMonths = getAvailableWorkDayMonths(history);
  const driversById = new Map();

  if (isOwner && currentUser?.id) {
    driversById.set(String(currentUser.id), {
      id: String(currentUser.id),
      name: currentUser.displayName || "Propietario",
    });
  }

  history
    .filter((workDay) => workDay.driverUserId)
    .forEach((workDay) => {
      driversById.set(String(workDay.driverUserId), {
        id: String(workDay.driverUserId),
        name: workDay.driverName || "Conductor",
      });
    });

  const availableDrivers = [...driversById.values()].sort(
    (left, right) => {
      if (String(left.id) === String(currentUser?.id)) {
        return -1;
      }

      if (String(right.id) === String(currentUser?.id)) {
        return 1;
      }

      return left.name.localeCompare(right.name, "es");
    }
  );
  const selectedDriverData = availableDrivers.find(
    (driver) => driver.id === String(selectedDriver)
  );
  const isPersonalHistory =
    String(selectedDriver) === String(currentUser?.id);
  const filteredHistory = visibleWorkDays.map((workDay) => ({
    ...workDay,
    summary: summariesById[workDay.id],
  }));

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDate("");
    setShowDaySearch(false);
  };

  const clearDaySearch = () => {
    setSelectedDate("");
    setShowDaySearch(false);
  };

  const handleDriverChange = (event) => {
    const driverId = event.target.value;
    setSelectedDriver(driverId);

    if (driverId) {
      setSearchParams({ driver: driverId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle
          title={
            isOwner
              ? isPersonalHistory
                ? "Mis jornadas"
                : `Jornadas de ${
                    selectedDriverData?.name || "conductor"
                  }`
              : "Historial"
          }
          subtitle={
            isOwner
              ? isPersonalHistory
                ? "Tu historial personal, separado del resto de conductores."
                : "Consulta de solo lectura. Tus jornadas permanecen separadas."
              : "Consulta tus jornadas anteriores."
          }
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
            {isOwner && (
              <div className="mb-4">
                <label
                  htmlFor="historyDriver"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Historial
                </label>
                <select
                  id="historyDriver"
                  value={selectedDriver}
                  onChange={handleDriverChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg font-bold text-white outline-none focus:border-emerald-500"
                >
                  {availableDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {String(driver.id) === String(currentUser?.id)
                        ? "Mis jornadas"
                        : `Jornadas de ${driver.name}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end gap-3">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="historyMonth"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Mes de las jornadas
                </label>
                <select
                  id="historyMonth"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg font-bold text-white outline-none focus:border-emerald-500"
                >
                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {formatWorkDayMonth(month)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowDaySearch(true)}
                className="shrink-0 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
              >
                Buscar día
              </button>
            </div>

            {showDaySearch && (
              <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                <label
                  htmlFor="historyDate"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Fecha de la jornada
                </label>
                <input
                  id="historyDate"
                  type="date"
                  value={selectedDate}
                  onChange={(event) =>
                    setSelectedDate(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg font-bold text-white outline-none focus:border-emerald-500"
                />

                <button
                  type="button"
                  onClick={clearDaySearch}
                  className="mt-3 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-[0.99]"
                >
                  Quitar búsqueda
                </button>
              </div>
            )}

            <p className="mt-2 text-sm text-slate-400">
              {filteredHistory.length}{" "}
              {filteredHistory.length === 1 ? "jornada" : "jornadas"}
            </p>
          </Card>

          {isLoadingSummaries ? (
            <Card>
              <p className="text-center text-slate-300">
                Cargando jornadas...
              </p>
            </Card>
          ) : summaryError ? (
            <Card className="border-red-500/30">
              <p className="font-bold text-white">
                No se pudieron cargar las jornadas
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {summaryError}
              </p>
              <button
                type="button"
                onClick={() =>
                  setSummaryReloadKey((current) => current + 1)
                }
                className="mt-4 w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
              >
                Reintentar
              </button>
            </Card>
          ) : selectedDate && filteredHistory.length === 0 ? (
            <Card>
              <p className="font-semibold text-white">
                No hay una jornada registrada este día.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Elige otra fecha o quita la búsqueda para volver al mes.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((workDay) => (
                <HistoryWorkDayCard
                  key={workDay.id}
                  workDay={workDay}
                  onClick={() => navigate(`/work-days/${workDay.id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default WorkDayHistoryPage;
