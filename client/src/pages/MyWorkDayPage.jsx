import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActiveTripCard from "../components/ActiveTripCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import Stat from "../components/ui/Stat";
import {
  cancelOpenWorkDay,
  getLatestClosedWorkDay,
  getOpenWorkDay,
} from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";
import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";
import { tripCountLabel } from "../utils/tripCountLabel";

function SteeringWheelIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="5">
      <circle cx="32" cy="32" r="25" />
      <circle cx="32" cy="32" r="5" />
      <path d="M8 27h48M32 37v20M28 35 15 48M36 35l13 13" strokeLinecap="round" />
    </svg>
  );
}

function MyWorkDayPage({ currentUser = null }) {
  const [openWorkDay, setOpenWorkDay] = useState(null);
  const [latestClosedWorkDay, setLatestClosedWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancellation, setShowCancellation] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationPassword, setCancellationPassword] = useState("");
  const [cancellationConfirmation, setCancellationConfirmation] = useState("");
  const [cancellationError, setCancellationError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const cancellationLockRef = useRef(false);
  const navigate = useNavigate();

  const loadMyWorkDay = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);
      const [active, latest] = await Promise.all([
        getOpenWorkDay(),
        getLatestClosedWorkDay(),
      ]);
      setOpenWorkDay(active);
      setLatestClosedWorkDay(latest);

      if (active) {
        const [activeSummary, activeTrips] = await Promise.all([
          getWorkDaySummary(active.id),
          getTripsByWorkDay(active.id),
        ]);
        setSummary(activeSummary);
        setTrips(activeTrips);
      } else {
        setSummary(null);
        setTrips([]);
      }
    } catch (loadError) {
      setError(loadError.message || "No se pudo cargar tu jornada");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyWorkDay();
  }, [loadMyWorkDay]);

  const handleCancelWorkDay = async () => {
    if (cancellationLockRef.current || !openWorkDay) return;
    cancellationLockRef.current = true;
    setIsCancelling(true);

    try {
      setCancellationError("");
      const hasTrips = trips.length > 0;

      if (hasTrips && cancellationReason.trim().length < 5) {
        throw new Error("Explica el motivo con al menos 5 caracteres");
      }
      if (hasTrips && !cancellationPassword) {
        throw new Error("Escribe tu contraseña actual");
      }
      if (
        hasTrips &&
        cancellationConfirmation.trim().toUpperCase() !== "CANCELAR"
      ) {
        throw new Error("Escribe CANCELAR para confirmar");
      }

      await cancelOpenWorkDay(openWorkDay.id, {
        cancellationReason,
        cancellationPassword,
        cancellationConfirmation: hasTrips
          ? cancellationConfirmation
          : "CANCELAR",
      });
      setShowCancellation(false);
      await loadMyWorkDay();
    } catch (cancelError) {
      setCancellationError(cancelError.message);
    } finally {
      cancellationLockRef.current = false;
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return <Card><p className="text-center text-slate-300">Cargando tu jornada...</p></Card>;
  }

  if (error) {
    return (
      <Card className="border-red-500/30">
        <p className="font-bold">No pudimos cargar tu jornada</p>
        <p className="mt-2 text-sm text-red-300">{error}</p>
        <Button onClick={loadMyWorkDay}>Reintentar</Button>
      </Card>
    );
  }

  if (!openWorkDay) {
    return (
      <section className="space-y-6">
        <SectionTitle title="Mi jornada" subtitle="Tu espacio de trabajo personal" />
        <button
          type="button"
          onClick={() => navigate("/new-work-day")}
          className="flex w-full items-center gap-5 rounded-3xl bg-emerald-300 px-6 py-7 text-left text-slate-950 shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-200 active:scale-[0.99]"
        >
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-950/10">
            <SteeringWheelIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-2xl font-black">Iniciar jornada</span>
            <span className="mt-1 block text-sm font-medium text-emerald-950/70">Comenzá tu turno</span>
          </span>
          <span className="text-4xl">›</span>
        </button>
        <Card>
          <p className="text-sm text-slate-400">Último kilometraje</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {latestClosedWorkDay?.endKm ?? "—"} km
          </p>
        </Card>
      </section>
    );
  }

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  const canCancel = currentUser?.id && openWorkDay.canManage !== false;

  return (
    <section className="space-y-6">
      <SectionTitle title="Mi jornada" subtitle="Jornada activa" />
      <Card className="border-emerald-500/30 bg-emerald-500/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-emerald-300">EN CURSO</p>
            <h2 className="mt-1 text-2xl font-bold">Turno iniciado</h2>
            <p className="mt-1 text-sm text-slate-300">Km inicial: {openWorkDay.startKm}</p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">En vivo</span>
        </div>

        {summary && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Stat label="Viajes" value={summary.tripCount} />
            <Stat label="Facturación" value={formatCurrency(summary.totalRevenue)} />
            <Stat label="Efectivo" value={formatCurrency(getDisplayedCash(summary))} detail={tripCountLabel(summary.cashTripCount)} />
            <Stat label="Datáfono" value={formatCurrency(summary.card)} detail={tripCountLabel(summary.cardTripCount)} />
          </div>
        )}

        <div className="mt-6"><Button onClick={() => navigate("/new-trip")}>Registrar viaje</Button></div>
        <button
          type="button"
          onClick={() => navigate("/close-work-day")}
          className="mt-3 w-full rounded-2xl border border-slate-700 px-5 py-4 font-bold text-slate-200"
        >
          Cerrar jornada
        </button>
      </Card>

      <Card>
        <h3 className="text-lg font-bold">Últimos viajes</h3>
        {sortedTrips.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Todavía no registraste viajes.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {sortedTrips.slice(0, 5).map((trip) => (
              <ActiveTripCard
                key={trip.id}
                trip={trip}
                time={new Date(trip.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
              />
            ))}
          </div>
        )}
      </Card>

      {canCancel && (
        <Card className="border-red-500/20 bg-red-500/5">
          <p className="text-xs font-bold tracking-[0.16em] text-red-300">ZONA DE SEGURIDAD</p>
          <h3 className="mt-2 text-lg font-bold">¿Abriste esta jornada por error?</h3>
          <p className="mt-2 text-sm text-slate-400">Podés cancelarla sin completar kilometraje final ni combustible. TaxFin conservará una auditoría.</p>
          <button type="button" onClick={() => setShowCancellation(true)} className="mt-5 w-full rounded-2xl border border-red-500/40 px-5 py-3 font-bold text-red-300">
            Cancelar jornada activa
          </button>
        </Card>
      )}

      {showCancellation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-bold">¿Cancelar esta jornada?</h3>
            <p className="mt-3 text-sm text-slate-300">
              {trips.length === 0
                ? "La jornada está vacía. No aparecerá en el historial ni afectará el kilometraje."
                : `Contiene ${tripCountLabel(trips.length)}. Se conservarán en la auditoría y la jornada dejará de afectar los totales.`}
            </p>
            {trips.length > 0 && (
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-semibold">Motivo
                  <textarea value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} rows={3} maxLength={500} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" />
                </label>
                <label className="block text-sm font-semibold">Contraseña actual
                  <input type="password" autoComplete="current-password" value={cancellationPassword} onChange={(e) => setCancellationPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" />
                </label>
                <label className="block text-sm font-semibold">Escribe CANCELAR
                  <input type="text" value={cancellationConfirmation} onChange={(e) => setCancellationConfirmation(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" />
                </label>
              </div>
            )}
            {cancellationError && <p className="mt-4 text-sm text-red-300">{cancellationError}</p>}
            <div className="mt-6 space-y-3">
              <button type="button" onClick={handleCancelWorkDay} disabled={isCancelling} className="w-full rounded-2xl bg-red-500 px-5 py-4 font-bold disabled:opacity-50">
                {isCancelling ? "Cancelando..." : "Sí, cancelar jornada"}
              </button>
              <button type="button" onClick={() => setShowCancellation(false)} disabled={isCancelling} className="w-full rounded-2xl border border-slate-700 px-5 py-4 font-bold text-slate-300">Volver</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyWorkDayPage;
