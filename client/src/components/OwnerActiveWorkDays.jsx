import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "./ui/Card";
import Stat from "./ui/Stat";
import { getWorkDays } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";
import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";
import { getManagedOpenWorkDays } from "../utils/getManagedOpenWorkDays";

const REFRESH_INTERVAL_MS = 30_000;

function OwnerActiveWorkDays() {
  const [activeWorkDays, setActiveWorkDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const navigate = useNavigate();
  const loadActiveWorkDays = useCallback(async ({ silent = false } = {}) => {
    try {
      setError("");
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const workDays = await getWorkDays();
      const managedOpenWorkDays = getManagedOpenWorkDays(workDays);
      const workDaysWithDetail = await Promise.all(
        managedOpenWorkDays.map(async (workDay) => {
          const [summary, trips] = await Promise.all([
            getWorkDaySummary(workDay.id),
            getTripsByWorkDay(workDay.id),
          ]);

          return {
            ...workDay,
            summary,
            trips: [...trips]
              .sort(
                (left, right) =>
                  new Date(right.createdAt || 0) -
                  new Date(left.createdAt || 0)
              )
              .slice(0, 5),
          };
        })
      );

      setActiveWorkDays(workDaysWithDetail);
      setLastUpdatedAt(new Date());
    } catch (loadError) {
      setError(
        loadError.message ||
          "No se pudo actualizar el seguimiento de conductores"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActiveWorkDays();

    const intervalId = window.setInterval(
      () => loadActiveWorkDays({ silent: true }),
      REFRESH_INTERVAL_MS
    );

    return () => window.clearInterval(intervalId);
  }, [loadActiveWorkDays]);

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">
            SEGUIMIENTO
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Conductores en servicio
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Vista de solo lectura · actualización cada 30 segundos
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadActiveWorkDays({ silent: true })}
          disabled={isLoading || isRefreshing}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 disabled:cursor-wait disabled:opacity-50"
        >
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate("/drivers")}
        className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
      >
        Gestionar conductores
      </button>

      {isLoading ? (
        <Card>
          <p className="text-center text-slate-300">
            Buscando jornadas activas...
          </p>
        </Card>
      ) : error ? (
        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            No pudimos actualizar el seguimiento
          </p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
        </Card>
      ) : activeWorkDays.length === 0 ? (
        <Card>
          <p className="font-semibold text-white">
            No hay conductores trabajando ahora.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Las jornadas aparecerán aquí cuando comiencen.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeWorkDays.map((workDay) => (
            <Card
              key={workDay.id}
              className="border-emerald-500/30 bg-emerald-500/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-emerald-300">
                    EN SERVICIO
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {workDay.driverName || "Conductor"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Km inicial: {workDay.startKm}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                  En vivo
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat
                  label="🚖 Viajes"
                  value={workDay.summary.tripCount}
                />
                <Stat
                  label="💶 Facturación"
                  value={formatCurrency(
                    workDay.summary.totalRevenue
                  )}
                />
                <Stat
                  label="💵 Efectivo"
                  value={formatCurrency(
                    getDisplayedCash(workDay.summary)
                  )}
                />
                <Stat
                  label="💳 Datáfono"
                  value={formatCurrency(workDay.summary.card)}
                />
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <h4 className="text-sm font-bold text-white">
                  Últimos viajes
                </h4>
                {workDay.trips.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-400">
                    Todavía no registró viajes.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {workDay.trips.map((trip) => (
                      <div
                        key={trip.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs text-slate-400">
                              {new Date(
                                trip.createdAt
                              ).toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              ·{" "}
                              {trip.paymentType === "cash"
                                ? "Efectivo"
                                : "Datáfono"}
                            </p>
                            {(Number(trip.commission || 0) > 0 ||
                              Number(trip.tip || 0) > 0) && (
                              <p className="mt-1 text-xs text-slate-400">
                                {Number(trip.commission || 0) > 0 &&
                                  `Comisión ${formatCurrency(
                                    trip.commission
                                  )}`}
                                {Number(trip.commission || 0) > 0 &&
                                  Number(trip.tip || 0) > 0 &&
                                  " · "}
                                {Number(trip.tip || 0) > 0 &&
                                  `Propina ${formatCurrency(trip.tip)}`}
                              </p>
                            )}
                          </div>
                          <p className="font-bold text-white">
                            {formatCurrency(trip.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {lastUpdatedAt && (
        <p className="text-right text-xs text-slate-500">
          Actualizado a las{" "}
          {lastUpdatedAt.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </section>
  );
}

export default OwnerActiveWorkDays;
