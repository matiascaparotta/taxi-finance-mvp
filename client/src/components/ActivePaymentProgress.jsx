import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";
import { tripCountLabel } from "../utils/tripCountLabel";

function ActivePaymentProgress({ summary }) {
  if (!summary) {
    return null;
  }

  const payments = [
    {
      label: "Facturación",
      amount: summary.totalRevenue,
      count: summary.tripCount,
      color: "text-white",
    },
    {
      label: "Efectivo",
      amount: getDisplayedCash(summary),
      count: summary.cashTripCount,
      color: "text-emerald-300",
    },
    {
      label: "Datáfono",
      amount: summary.card,
      count: summary.cardTripCount,
      color: "text-blue-300",
    },
  ];

  return (
    <aside
      aria-label="Acumulado de la jornada"
      className="grid grid-cols-3 divide-x divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/50"
    >
      {payments.map((payment) => (
        <div key={payment.label} className="min-w-0 px-2 py-3 text-center sm:px-4">
          <p className="text-xs font-semibold text-slate-400">
            {payment.label}
          </p>
          <p className={`mt-1 truncate text-sm font-bold sm:text-base ${payment.color}`}>
            {formatCurrency(payment.amount)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {tripCountLabel(payment.count)}
          </p>
        </div>
      ))}
    </aside>
  );
}

export default ActivePaymentProgress;
