import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "./ui/Card";
import { getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";
import { getManagedOpenWorkDays } from "../utils/getManagedOpenWorkDays";

const REFRESH_INTERVAL_MS = 30_000;

function DriverStatusDot({ active }) {
  return (
    <span
      aria-hidden="true"
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
        active ? "bg-emerald-400 shadow-sm shadow-emerald-400" : "bg-slate-500"
      }`}
    />
  );
}

function OwnerActiveWorkDays({ currentUser }) {
  const [activeWorkDays, setActiveWorkDays] = useState([]);
  const [managedDrivers, setManagedDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const navigate = useNavigate();

  const loadOverview = useCallback(async ({ silent = false } = {}) => {
    try {
      setError("");
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const workDays = await getWorkDays();
      const openWorkDays = getManagedOpenWorkDays(workDays);
      const driversById = new Map();

      workDays.forEach((workDay) => {
        if (
          workDay.driverUserId &&
          Number(workDay.driverUserId) !== Number(currentUser?.id)
        ) {
          driversById.set(String(workDay.driverUserId), {
            id: workDay.driverUserId,
            name: workDay.driverName || "Conductor",
          });
        }
      });

      const detailedOpenWorkDays = await Promise.all(
        openWorkDays.map(async (workDay) => ({
          ...workDay,
          summary: await getWorkDaySummary(workDay.id),
        }))
      );

      setManagedDrivers(
        [...driversById.values()].sort((left, right) =>
          left.name.localeCompare(right.name, "es")
        )
      );
      setActiveWorkDays(detailedOpenWorkDays);
      setLastUpdatedAt(new Date());
    } catch (loadError) {
      setError(loadError.message || "No se pudo actualizar el equipo");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadOverview();
    const intervalId = window.setInterval(
      () => loadOverview({ silent: true }),
      REFRESH_INTERVAL_MS
    );
    return () => window.clearInterval(intervalId);
  }, [loadOverview]);

  const activeByDriver = new Map(
    activeWorkDays.map((workDay) => [String(workDay.driverUserId), workDay])
  );
  const activeCount = activeWorkDays.length;

  return (
    <section className="space-y-4">
      <Card className={activeCount > 0 ? "border-emerald-500/30" : ""}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-300">
              ↗
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">
                RESUMEN DEL DÍA
              </p>
              <div className="mt-1 flex items-center gap-2">
                <DriverStatusDot active={activeCount > 0} />
                <h2 className="truncate text-lg font-bold text-white">
                  {isLoading
                    ? "Comprobando el equipo..."
                    : activeCount === 0
                      ? "Sin conductores en servicio"
                      : activeCount === 1
                        ? "1 conductor en servicio"
                        : `${activeCount} conductores en servicio`}
                </h2>
              </div>
              {lastUpdatedAt && !isLoading && (
                <p className="mt-1 text-xs text-slate-500">
                  Actualizado a las {lastUpdatedAt.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadOverview({ silent: true })}
            disabled={isLoading || isRefreshing}
            aria-label="Actualizar resumen del equipo"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 text-lg text-slate-400 transition hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-50"
          >
            {isRefreshing ? "…" : "↻"}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">
              EQUIPO
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">Mis conductores</h2>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
            {managedDrivers.length}
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-800 border-y border-slate-800">
          {isLoading ? (
            <p className="py-5 text-sm text-slate-400">Cargando equipo...</p>
          ) : managedDrivers.length === 0 ? (
            <p className="py-5 text-sm text-slate-400">
              Todavía no hay jornadas de otros conductores.
            </p>
          ) : (
            managedDrivers.map((driver) => {
              const activeWorkDay = activeByDriver.get(String(driver.id));
              return (
                <button
                  key={driver.id}
                  type="button"
                  onClick={() =>
                    navigate(
                      activeWorkDay
                        ? `/work-days/${activeWorkDay.id}`
                        : `/history?driver=${driver.id}`
                    )
                  }
                  className="flex w-full items-center gap-3 py-4 text-left transition hover:bg-slate-900/60"
                  aria-label={`${driver.name}: ${
                    activeWorkDay ? "en servicio" : "fuera de servicio"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-black text-slate-200">
                    {driver.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-white">
                      {driver.name}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <DriverStatusDot active={Boolean(activeWorkDay)} />
                      {activeWorkDay ? "En servicio" : "Fuera de servicio"}
                    </span>
                    {activeWorkDay?.summary && (
                      <span className="mt-2 block space-y-1 text-xs text-slate-300">
                        <span className="block">
                          {activeWorkDay.summary.tripCount} viajes · {formatCurrency(
                            activeWorkDay.summary.totalRevenue
                          )}
                        </span>
                        <span className="block text-slate-500">
                          E {formatCurrency(getDisplayedCash(activeWorkDay.summary))} ({activeWorkDay.summary.cashTripCount}) · D {formatCurrency(activeWorkDay.summary.card)} ({activeWorkDay.summary.cardTripCount})
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="text-2xl text-slate-500">›</span>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="rounded-2xl border border-slate-700 px-3 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Ver jornadas
          </button>
          <button
            type="button"
            onClick={() => navigate("/drivers")}
            className="rounded-2xl border border-slate-700 px-3 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Gestionar conductores
          </button>
        </div>
      </Card>
    </section>
  );
}

export default OwnerActiveWorkDays;
