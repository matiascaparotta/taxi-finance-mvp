import Card from "./ui/Card";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { getDisplayedCash } from "../utils/getDisplayedCash";

function HistoryWorkDayCard({ workDay, onClick }) {
  const summary = workDay.summary ?? {};
  const workDayDate = workDay.date ?? workDay.workDate;

  const workedKm = Number(
    summary.workedKm ??
      workDay.totalKm ??
      workDay.workedKm ??
      Number(workDay.endKm || 0) - Number(workDay.startKm || 0)
  );
  const totalRevenue =
    summary.totalRevenue ?? workDay.totalRevenue ?? workDay.total;
  const displayedCash = getDisplayedCash({
    realCash: summary.realCash ?? workDay.realCash,
    cash: summary.cash ?? workDay.cash,
  });
  const displayedCard = summary.card ?? workDay.card;
  const fuelOwn = Number(
    summary.fuelOwn ?? workDay.fuelOwn ?? workDay.fuel_own ?? 0
  );
  const fuelJose = Number(
    summary.fuelJose ?? workDay.fuelJose ?? workDay.fuel_jose ?? 0
  );
  const hasTripBreakdown =
    summary.tripCount !== undefined &&
    summary.cashTripCount !== undefined &&
    summary.cardTripCount !== undefined;

  const formatValue = (value) =>
    value !== undefined && value !== null
      ? formatCurrency(value)
      : "Ver detalle";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
      aria-label={`Ver jornada del ${formatDate(workDayDate)}`}
    >
      <Card className="transition hover:border-emerald-500/40 hover:bg-slate-900 active:scale-[0.99]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-emerald-300">
              JORNADA
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">
              {formatDate(workDayDate)}
            </h3>
            {workDay.driverName && (
              <p className="mt-1 text-sm font-semibold text-slate-400">
                {workDay.driverName}
              </p>
            )}
          </div>
          <span className="text-xl text-slate-500" aria-hidden="true">
            →
          </span>
        </div>

        <div className="my-5 border-t border-slate-800" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Facturación</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {formatValue(totalRevenue)}
            </p>
          </div>
          <p className="pb-1 text-sm font-semibold text-slate-300">
            {workedKm} km
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-6 border-y border-slate-800 py-4">
          <div>
            <p className="text-sm text-slate-400">Efectivo</p>
            <p className="mt-1 text-lg font-bold text-white">
              {formatValue(displayedCash)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Datáfono</p>
            <p className="mt-1 text-lg font-bold text-white">
              {formatValue(displayedCard)}
            </p>
          </div>
        </div>

        {hasTripBreakdown && (
          <div className="mt-4 flex items-center justify-between gap-4 text-sm">
            <p className="text-slate-400">
              <span className="font-bold text-white">{summary.tripCount}</span>{" "}
              {summary.tripCount === 1 ? "viaje" : "viajes"}
            </p>
            <p className="font-semibold text-slate-300">
              {summary.cashTripCount} E | {summary.cardTripCount} D
            </p>
          </div>
        )}

        {(fuelOwn > 0 || fuelJose > 0) && (
          <div className="mt-4 space-y-2 rounded-xl bg-slate-950/70 px-4 py-3 text-sm">
            {fuelOwn > 0 && (
              <div className="flex items-center justify-between gap-4">
                <p className="text-slate-400">Gasolina</p>
                <p className="font-semibold text-white">
                  {formatCurrency(fuelOwn)}
                </p>
              </div>
            )}
            {fuelJose > 0 && (
              <div className="flex items-center justify-between gap-4">
                <p className="text-slate-400">Gasolina José</p>
                <p className="font-semibold text-white">
                  {formatCurrency(fuelJose)}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </button>
  );
}

export default HistoryWorkDayCard;
