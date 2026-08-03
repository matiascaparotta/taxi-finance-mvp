import Card from "./ui/Card";
import Stat from "./ui/Stat";
import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";

function WorkDaySummaryCard({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-white">Resumen de jornada</h3>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Stat label="🚖 Viajes" value={summary.tripCount} />
        <Stat
          label="💶 Facturación"
          value={formatCurrency(summary.totalRevenue)}
        />
        <Stat
          label="💵 Efectivo"
          value={formatCurrency(getDisplayedCash(summary))}
        />
        <Stat
          label="💳 Datáfono"
          value={formatCurrency(summary.card)}
        />
      </div>
      {(Number(summary.commission || 0) > 0 || Number(summary.tip || 0) > 0) && (
        <div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
          <div className="grid grid-cols-2 gap-3"><Stat label="Comisiones" value={formatCurrency(summary.commission)} /><Stat label="Propinas" value={formatCurrency(summary.tip)} /></div>
          {summary.commissionByCompany?.length > 0 && <div className="mt-4 space-y-2 border-t border-sky-500/20 pt-3">{summary.commissionByCompany.map((item) => <div key={item.name} className="flex justify-between gap-3 text-sm"><span className="text-slate-300">{item.name} · {item.tripCount} viajes</span><strong>{formatCurrency(item.amount)}</strong></div>)}</div>}
        </div>
      )}
    </Card>
  );
}

export default WorkDaySummaryCard;
