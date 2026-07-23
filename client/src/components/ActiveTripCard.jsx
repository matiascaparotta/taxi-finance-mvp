import { formatCurrency } from "../utils/formatCurrency";

function ActiveTripCard({ trip, time, onClick }) {
  const commission = Number(trip.commission || 0);
  const tip = Number(trip.tip || 0);
  const hasAdjustments = commission > 0 || tip > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-left transition hover:border-emerald-500/40 hover:bg-slate-900 active:scale-[0.99]"
      aria-label={`Editar viaje de ${formatCurrency(trip.amount)}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            🕙 {time} ·{" "}
            {trip.paymentType === "cash"
              ? "💵 Efectivo"
              : "💳 Datáfono"}
          </p>

          <p className="mt-1 text-lg font-bold text-white">
            {formatCurrency(trip.amount)}
          </p>
        </div>

        <span className="pt-1 text-slate-500" aria-hidden="true">
          →
        </span>
      </div>

      {hasAdjustments && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800 pt-3 text-sm">
          {commission > 0 && (
            <p className="text-slate-300">
              Comisión{" "}
              <strong className="text-white">
                {formatCurrency(commission)}
              </strong>
            </p>
          )}

          {tip > 0 && (
            <p className="text-slate-300">
              Propina{" "}
              <strong className="text-white">
                {formatCurrency(tip)}
              </strong>
            </p>
          )}
        </div>
      )}
    </button>
  );
}

export default ActiveTripCard;
