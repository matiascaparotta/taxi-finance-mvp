import Card from "./ui/Card";
import Stat from "./ui/Stat";
import { formatDate } from "../utils/formatDate";

function WorkDayCard({ workDay }) {
  return (
    <Card className="transition hover:border-emerald-500/40 hover:bg-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Jornada</p>

          <h3 className="mt-1 text-xl font-bold">
            📅 {formatDate(workDay.date)}
          </h3>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
          Ver →
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Stat
          label="🚖 Km trabajados"
          value={`${workDay.workedKm} km`}
        />

        <Stat
          label="⛽ Combustible"
          value={`${workDay.fuelOwn} €`}
        />
      </div>
    </Card>
  );
}

export default WorkDayCard;