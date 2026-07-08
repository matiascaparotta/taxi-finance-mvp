import { useNavigate } from "react-router-dom";

import Card from "./ui/Card";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

function WorkDayCard({ workDay }) {
  const navigate = useNavigate();

  if (!workDay) {
    return null;
  }

  const startKm = workDay.startKm;
  const endKm = workDay.endKm;

  const workedKm =
    workDay.totalKm ??
    workDay.workedKm ??
    (endKm !== null && endKm !== undefined
      ? Number(endKm) - Number(startKm || 0)
      : null);

  const workDayDate = workDay.date || workDay.workDate;
  const formattedDate = workDayDate
    ? formatDate(workDayDate)
    : "Fecha no disponible";

  const totalRevenue =
    workDay.summary?.totalRevenue ?? workDay.totalRevenue ?? workDay.total;

  const cash = workDay.summary?.cash ?? workDay.cash;
  const card = workDay.summary?.card ?? workDay.card;
  const fuelOwn = workDay.fuelOwn ?? workDay.fuel_own ?? 0;

  return (
    <button
      type="button"
      onClick={() => navigate(`/work-days/${workDay.id}`)}
      className="w-full text-left"
    >
      <Card className="transition hover:border-emerald-500/40 hover:bg-slate-800 active:scale-[0.99]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Jornada</p>

            <h3 className="mt-1 text-xl font-bold text-white">
              📅 {formattedDate}
            </h3>
          </div>

          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            Ver →
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-sm font-medium text-emerald-300">
            Total facturado
          </p>

          <p className="mt-1 text-3xl font-bold text-white">
            {totalRevenue !== undefined && totalRevenue !== null
              ? formatCurrency(totalRevenue)
              : "Ver detalle"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">💵 Efectivo</p>
            <p className="mt-1 text-lg font-bold text-white">
              {cash !== undefined && cash !== null
                ? formatCurrency(cash)
                : "Ver detalle"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">💳 Datáfono</p>
            <p className="mt-1 text-lg font-bold text-white">
              {card !== undefined && card !== null
                ? formatCurrency(card)
                : "Ver detalle"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div className="rounded-xl bg-slate-800 px-3 py-3">
            <p className="text-slate-400">Km inicial</p>
            <p className="mt-1 font-bold text-white">
              {startKm ?? "-"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 px-3 py-3">
            <p className="text-slate-400">Km final</p>
            <p className="mt-1 font-bold text-white">
              {endKm ?? "-"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 px-3 py-3">
            <p className="text-slate-400">Total km</p>
            <p className="mt-1 font-bold text-white">
              {workedKm !== null && workedKm !== undefined
                ? `${workedKm} km`
                : "-"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 px-3 py-3">
            <p className="text-slate-400">Gasolina</p>
            <p className="mt-1 font-bold text-white">
              {formatCurrency(fuelOwn)}
            </p>
          </div>
        </div>
      </Card>
    </button>
  );
}

export default WorkDayCard;