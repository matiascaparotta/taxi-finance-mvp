import Card from "./ui/Card";
import Stat from "./ui/Stat";

function WorkDaySummaryCard({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-white">Resumen de jornada</h3>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Stat label="🚖 Viajes" value={summary.tripCount} />
        <Stat label="💶 Facturación" value={`${summary.totalRevenue} €`} />
        <Stat label="💵 Efectivo" value={`${summary.cash} €`} />
        <Stat label="💳 Datáfono" value={`${summary.card} €`} />
      </div>
    </Card>
  );
}

export default WorkDaySummaryCard;