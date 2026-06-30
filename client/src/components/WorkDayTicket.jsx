import Card from "./ui/Card";
import Stat from "./ui/Stat";
import { formatDate } from "../utils/formatDate";

function WorkDayTicket({ workDay, summary }) {
  if (!workDay || !summary) {
    return null;
  }

  const workedKm =
    workDay.endKm !== null
      ? Number(workDay.endKm) - Number(workDay.startKm)
      : null;

  return (
    <Card className="border-emerald-500/30 bg-slate-950">
      <div className="text-center">
        <p className="text-sm font-semibold text-emerald-300">
          TAXI FINANCE
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Jornada finalizada
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {formatDate(workDay.date)}
        </p>
      </div>

      <div className="my-6 border-t border-dashed border-slate-700" />

      <div className="grid grid-cols-2 gap-4">
        <Stat label="🚖 Viajes" value={summary.tripCount} />
        <Stat label="📍 Km" value={`${workedKm} km`} />
        <Stat label="💶 Facturación" value={`${summary.totalRevenue} €`} />
        <Stat label="💳 Datáfono" value={`${summary.card} €`} />
        <Stat label="💵 Efectivo" value={`${summary.cash} €`} />
        <Stat label="⛽ Combustible" value={`${workDay.fuelOwn} €`} />
      </div>
    </Card>
  );
}

export default WorkDayTicket;