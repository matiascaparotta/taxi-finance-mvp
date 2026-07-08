import Card from "./ui/Card";
import Stat from "./ui/Stat";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

function WorkDayTicket({ workDay, summary }) {
  if (!workDay || !summary) {
    return null;
  }

  const startKm = workDay.startKm;
  const endKm = workDay.endKm;

  const workedKm =
    endKm !== null && endKm !== undefined
      ? Number(endKm) - Number(startKm || 0)
      : null;

  const fuelOwn = workDay.fuelOwn ?? workDay.fuel_own ?? 0;
  const workDayDate = workDay.date || workDay.workDate;

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
          {workDayDate ? formatDate(workDayDate) : "Fecha no disponible"}
        </p>
      </div>

      <div className="my-6 border-t border-dashed border-slate-700" />

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-sm font-medium text-emerald-300">
          Total facturado
        </p>

        <p className="mt-1 text-3xl font-bold text-white">
          {formatCurrency(summary.totalRevenue)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Stat label="💵 Efectivo" value={formatCurrency(summary.cash)} />
        <Stat label="💳 Datáfono" value={formatCurrency(summary.card)} />
        <Stat label="🚖 Viajes" value={summary.tripCount} />
        <Stat label="⛽ Combustible" value={formatCurrency(fuelOwn)} />
        <Stat label="📍 Km inicial" value={startKm ?? "-"} />
        <Stat label="🏁 Km final" value={endKm ?? "-"} />
        <Stat
          label="🛣️ Km trabajados"
          value={workedKm !== null && workedKm !== undefined ? `${workedKm} km` : "-"}
        />
      </div>
    </Card>
  );
}

export default WorkDayTicket;