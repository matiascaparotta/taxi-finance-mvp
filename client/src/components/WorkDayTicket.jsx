import Card from "./ui/Card";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

function formatTripTime(trip) {
  const rawDate = trip.createdAt || trip.created_at || trip.createdAtFormatted;

  if (!rawDate) {
    return "--:--";
  }

  return new Date(rawDate).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WorkDayTicket({ workDay, summary, trips = [], onTripClick }) {
  if (!workDay || !summary) {
    return null;
  }

  const startKm = Number(workDay.startKm ?? summary.startKm ?? 0);
  const endKm = Number(workDay.endKm ?? summary.endKm ?? 0);
  const workedKm = Number(summary.workedKm ?? endKm - startKm);
  const fuelOwn = Number(summary.fuelOwn ?? workDay.fuelOwn ?? 0);
  const fuelJose = Number(summary.fuelJose ?? workDay.fuelJose ?? 0);
  const displayedCash = summary.realCash ?? summary.cash;
  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);

    return dateA - dateB;
  });

  const renderTripContent = (trip) => (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">
            {formatTripTime(trip)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {trip.paymentType === "cash" ? "Efectivo" : "Datáfono"}
          </p>
        </div>
        <p className="text-lg font-bold text-white">
          {formatCurrency(trip.amount)}
        </p>
      </div>

      {(Number(trip.commission || 0) > 0 ||
        Number(trip.tip || 0) > 0) && (
        <div className="mt-3 space-y-1 border-t border-slate-800 pt-3 text-xs text-slate-400">
          {Number(trip.commission || 0) > 0 && (
            <p>Comisión: {formatCurrency(trip.commission)}</p>
          )}
          {Number(trip.tip || 0) > 0 && (
            <p>Propina: {formatCurrency(trip.tip)}</p>
          )}
        </div>
      )}
    </>
  );

  return (
    <Card className="border-emerald-500/30 bg-slate-950">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-300">
          TAXI FINANCE
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Jornada finalizada
        </h2>
      </div>

      <section className="mt-7">
        <h3 className="text-xs font-bold tracking-[0.18em] text-emerald-300">
          JORNADA
        </h3>
        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="font-bold text-white">
            {workDay.date ? formatDate(workDay.date) : "Fecha no disponible"}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Km inicial</p>
              <p className="mt-1 font-semibold text-white">{startKm}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Km final</p>
              <p className="mt-1 font-semibold text-white">{endKm}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Trabajados</p>
              <p className="mt-1 font-semibold text-white">{workedKm} km</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <h3 className="text-xs font-bold tracking-[0.18em] text-emerald-300">
          VIAJES
        </h3>

        {sortedTrips.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
            No se registraron viajes en esta jornada.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {sortedTrips.map((trip) =>
              onTripClick ? (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => onTripClick(trip)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-emerald-500/40 active:scale-[0.99]"
                >
                  {renderTripContent(trip)}
                </button>
              ) : (
                <div
                  key={trip.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                >
                  {renderTripContent(trip)}
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section className="mt-7">
        <h3 className="text-xs font-bold tracking-[0.18em] text-emerald-300">
          RESUMEN
        </h3>
        <div className="mt-3 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/70 px-4">
          <div className="flex items-center justify-between py-3">
            <p className="text-sm text-slate-400">Viajes</p>
            <p className="font-semibold text-white">
              {summary.tripCount} ({summary.cashTripCount} E |{" "}
              {summary.cardTripCount} D)
            </p>
          </div>
          <div className="flex items-center justify-between py-3">
            <p className="text-sm text-slate-400">Efectivo</p>
            <p className="font-semibold text-white">
              {formatCurrency(displayedCash)}
            </p>
          </div>
          <div className="flex items-center justify-between py-3">
            <p className="text-sm text-slate-400">Datáfono</p>
            <p className="font-semibold text-white">
              {formatCurrency(summary.card)}
            </p>
          </div>
          <div className="flex items-center justify-between py-3">
            <p className="text-sm text-slate-400">Facturación</p>
            <p className="font-bold text-emerald-300">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>
          {fuelOwn > 0 && (
            <div className="flex items-center justify-between py-3">
              <p className="text-sm text-slate-400">Gasolina</p>
              <p className="font-semibold text-white">
                {formatCurrency(fuelOwn)}
              </p>
            </div>
          )}
          {fuelJose > 0 && (
            <div className="flex items-center justify-between py-3">
              <p className="text-sm text-slate-400">Gasolina José</p>
              <p className="font-semibold text-white">
                {formatCurrency(fuelJose)}
              </p>
            </div>
          )}
        </div>
      </section>
    </Card>
  );
}

export default WorkDayTicket;
