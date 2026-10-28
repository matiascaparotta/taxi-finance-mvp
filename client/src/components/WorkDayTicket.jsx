import { useEffect, useState } from "react";

import Card from "./ui/Card";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";
import { getWorkDayOrganizationName } from "../config/branding";
import DailySettlementCard from "./DailySettlementCard";

const INITIAL_VISIBLE_TRIPS = 8;

function formatTripTime(trip) {
  const rawDate = trip.createdAt || trip.created_at || trip.createdAtFormatted;

  if (!rawDate) {
    return "--:--";
  }

  return new Date(rawDate).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WorkDayTicket({
  workDay,
  summary,
  trips = [],
  onEditTrip = null,
  onRegisterSettlementPayment = null,
  onRegisterSettlementAdjustment = null,
}) {
  const [showAllTrips, setShowAllTrips] = useState(false);

  useEffect(() => {
    setShowAllTrips(false);
  }, [workDay?.id]);

  if (!workDay || !summary) {
    return null;
  }

  const startKm = Number(workDay.startKm ?? summary.startKm ?? 0);
  const endKm = Number(workDay.endKm ?? summary.endKm ?? 0);
  const workedKm = Number(summary.workedKm ?? endKm - startKm);
  const fuelOwn = Number(summary.fuelOwn ?? workDay.fuelOwn ?? 0);
  const fuelJose = Number(summary.fuelJose ?? workDay.fuelJose ?? 0);
  const displayedCash = getDisplayedCash(summary);
  const totalTip = Number(summary.tip || 0);
  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);

    return dateA - dateB;
  });
  const hasHiddenTrips =
    sortedTrips.length > INITIAL_VISIBLE_TRIPS;
  const visibleTrips = showAllTrips
    ? sortedTrips
    : sortedTrips.slice(0, INITIAL_VISIBLE_TRIPS);

  const renderTripContent = (trip) => {
    const commission = Number(trip.commission || 0);
    const tip = Number(trip.tip || 0);
    const chargedAmount = Number(trip.amount || 0);
    const fareAmount = Math.max(0, chargedAmount - tip);
    const hasAdjustments = commission > 0 || tip > 0;

    return (
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3.5 sm:grid-cols-[4rem_minmax(0,1fr)_auto_auto]">
        <p className="text-base font-black tabular-nums text-white">
          {formatTripTime(trip)}
        </p>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-200">
            {trip.paymentType === "cash" ? "Efectivo" : "Datáfono"}
          </p>
          {hasAdjustments && (
            <p className="mt-1 truncate text-xs text-sky-300">
              {commission > 0 && `Comisión ${formatCurrency(commission)}${trip.commissionCompanyName ? ` · ${trip.commissionCompanyName}` : ""}`}
              {commission > 0 && tip > 0 && " · "}
              {tip > 0 && `${trip.paymentType === "cash" ? "Pagó" : "Cobrado"} ${formatCurrency(chargedAmount)} · Propina ${formatCurrency(tip)}`}
            </p>
          )}
        </div>

        <p className="whitespace-nowrap text-right text-base font-black tabular-nums text-white sm:text-lg">
          {formatCurrency(fareAmount)}
        </p>

        {onEditTrip && (
          <button
            type="button"
            onClick={() => onEditTrip(trip)}
            aria-label={`Corregir viaje de ${formatCurrency(trip.amount)}`}
            title="Corregir viaje"
            className="col-start-3 row-start-2 justify-self-end rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-400 transition hover:border-emerald-500/40 hover:text-emerald-300 sm:col-start-4 sm:row-start-1 sm:px-3"
          >
            <span aria-hidden="true">✎</span>
            <span className="sr-only sm:not-sr-only sm:ml-1.5 sm:text-xs sm:font-bold">Corregir</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <Card className="border-emerald-500/30 bg-slate-950">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-300">
          {getWorkDayOrganizationName(workDay)}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Jornada finalizada
        </h2>
      </div>

      <section className="mt-7">
        <h3 className="text-xs font-bold tracking-[0.18em] text-emerald-300">
          JORNADA
        </h3>
        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="font-bold text-white">
            {workDay.date ? formatDate(workDay.date) : "Fecha no disponible"}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Km inicial</p>
              <p className="mt-1 font-semibold text-white">{startKm}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Km final</p>
              <p className="mt-1 font-semibold text-white">{endKm}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Trabajados</p>
              <p className="mt-1 font-semibold text-white">{workedKm} km</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-[0.8fr_1.2fr] gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Viajes</p>
          <p className="mt-1 text-2xl font-black text-white">{summary.tripCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-300">Facturación total</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-white sm:text-3xl">
            {formatCurrency(summary.totalRevenue)}
          </p>
        </div>
      </section>

      <section className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-300">Propina personal</p>
            <p className="mt-1 text-xs text-slate-400">Visible solo en tu cuenta</p>
          </div>
          <p className="text-2xl font-black tabular-nums text-white">{formatCurrency(totalTip)}</p>
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold tracking-[0.18em] text-emerald-300">VIAJES</h3>
            <p className="mt-1 text-sm text-slate-400">Ordenados por horario</p>
          </div>
          <p className="text-xs font-bold text-slate-500">{summary.cashTripCount} efectivo · {summary.cardTripCount} datáfono</p>
        </div>

        {sortedTrips.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
            No se registraron viajes en esta jornada.
          </p>
        ) : (
          <div className="mt-3">
            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 sm:px-4">
              {visibleTrips.map((trip) => (
                <div key={trip.id}>{renderTripContent(trip)}</div>
              ))}
            </div>

            {hasHiddenTrips && (
              <button
                type="button"
                onClick={() => setShowAllTrips((current) => !current)}
                className="mt-3 w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
              >
                {showAllTrips
                  ? "Mostrar menos"
                  : `Ver los ${sortedTrips.length} viajes`}
              </button>
            )}
          </div>
        )}
      </section>

      <section className="mt-7">
        <h3 className="text-xs font-bold tracking-[0.18em] text-emerald-300">
          RESUMEN
        </h3>
        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Efectivo</p>
              <p className="mt-1 font-bold tabular-nums text-white">{formatCurrency(displayedCash)}</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Datáfono</p>
              <p className="mt-1 font-bold tabular-nums text-white">{formatCurrency(summary.card)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p className="text-sm font-bold text-emerald-200">Facturación total</p>
            <p className="text-xl font-black tabular-nums text-white">{formatCurrency(summary.totalRevenue)}</p>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <div>
              <p className="text-sm font-bold text-amber-200">Propina personal</p>
              <p className="text-xs text-slate-400">No se comparte en el resumen</p>
            </div>
            <p className="text-xl font-black tabular-nums text-white">{formatCurrency(totalTip)}</p>
          </div>
          <div className="mt-3 divide-y divide-slate-800">
          {fuelOwn > 0 && (
            <div className="flex items-center justify-between py-3">
              <p className="text-sm text-slate-400">Gasolina</p>
              <p className="font-semibold text-white">
                {formatCurrency(fuelOwn)}
              </p>
            </div>
          )}
          {fuelJose > 0 && (
            <div className="flex items-center justify-between py-3">
              <p className="text-sm text-slate-400">Gasolina José</p>
              <p className="font-semibold text-white">
                {formatCurrency(fuelJose)}
              </p>
            </div>
          )}
          </div>
        </div>
      </section>

      <DailySettlementCard
        settlement={summary.dailySettlement}
        commissionSummary={{
          total: summary.commission,
          cash: summary.cashCommission,
          card: summary.cardCommission,
          byCompany: summary.commissionByCompany,
        }}
        onRegisterPayment={onRegisterSettlementPayment}
        onRegisterAdjustment={onRegisterSettlementAdjustment}
      />
    </Card>
  );
}

export default WorkDayTicket;
