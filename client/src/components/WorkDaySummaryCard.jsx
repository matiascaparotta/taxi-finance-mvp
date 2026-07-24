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
    </Card>
  );
}

export default WorkDaySummaryCard;
