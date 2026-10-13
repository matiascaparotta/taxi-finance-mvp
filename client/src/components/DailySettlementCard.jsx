import { formatCurrency } from "../utils/formatCurrency";
import { getDailySettlementPresentation } from "../utils/getDailySettlementPresentation";
import { getPendingBalancePresentation } from "../utils/getPendingBalancePresentation";

const RESULT_STYLES = {
  sky: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  slate: "border-slate-600 bg-slate-800/70 text-slate-200",
};

function SettlementRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <p className={strong ? "font-bold text-white" : "text-sm text-slate-400"}>
        {label}
      </p>
      <p className={strong ? "text-lg font-black text-white" : "font-semibold text-white"}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function DailySettlementCard({ settlement }) {
  if (!settlement) {
    return null;
  }

  const result = getDailySettlementPresentation(settlement);
  const percentage = Number(settlement.driverSharePercentage || 0);
  const pendingBalance = Number(settlement.pendingBalance || 0);
  const pending = getPendingBalancePresentation(pendingBalance);

  return (
    <section className="mt-7" aria-labelledby="daily-settlement-title">
      <h3
        id="daily-settlement-title"
        className="text-xs font-bold tracking-[0.18em] text-sky-300"
      >
        LIQUIDACIÓN DEL DÍA
      </h3>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 px-4">
        <div className="divide-y divide-slate-800">
          <SettlementRow label="Facturación neta" value={settlement.netRevenue} />
          <SettlementRow label="Seguridad Social" value={-settlement.socialSecurity} />
          <SettlementRow label="Gasolina" value={-settlement.fuelCost} />
          <SettlementRow label="Base para repartir" value={settlement.distributableBase} strong />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-700 py-4">
          <div className="rounded-xl bg-slate-950/70 p-3">
            <p className="text-xs text-slate-400">Tu parte · {percentage} %</p>
            <p className="mt-1 text-lg font-black text-white">
              {formatCurrency(settlement.driverShare)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-950/70 p-3">
            <p className="text-xs text-slate-400">Parte del jefe</p>
            <p className="mt-1 text-lg font-black text-white">
              {formatCurrency(settlement.ownerShare)}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800 border-t border-slate-700">
          <SettlementRow label="Reintegro de gasolina" value={settlement.reimbursableFuel} />
          <SettlementRow label="Total que te corresponde" value={settlement.driverEntitlement} strong />
          <SettlementRow label="Efectivo que conservaste" value={settlement.cashRetained} />
        </div>
      </div>

      <div className={`mt-3 rounded-2xl border p-5 ${RESULT_STYLES[result.tone]}`}>
        <p className="text-xs font-black tracking-[0.16em]">{result.eyebrow}</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="text-lg font-black text-white">{result.title}</p>
          <p className="text-3xl font-black text-white">
            {formatCurrency(result.amount)}
          </p>
        </div>
        <p className="mt-2 text-sm opacity-80">{result.description}</p>
      </div>

      <div className={`mt-3 rounded-2xl border p-5 ${pending.tone}`}>
        <p className="text-xs font-black tracking-[0.16em]">
          SALDO PENDIENTE ACUMULADO
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="text-base font-black text-white">{pending.label}</p>
          <p className="text-2xl font-black text-white">
            {formatCurrency(Math.abs(pendingBalance))}
          </p>
        </div>
        <p className="mt-2 text-sm opacity-80">
          Incluye todas tus jornadas diarias cerradas.
        </p>
      </div>
    </section>
  );
}

export default DailySettlementCard;
