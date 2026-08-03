import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";

import WorkDayShareCard from "../components/WorkDayShareCard";
import WorkDayTicket from "../components/WorkDayTicket";

import {
  deleteWorkDay,
  getWorkDayById,
} from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";

import { formatDate } from "../utils/formatDate";
import { buildWorkDaySummaryText } from "../utils/buildWorkDaySummaryText";
import { copyTextToClipboard } from "../utils/copyTextToClipboard";
import { formatCurrency } from "../utils/formatCurrency";
import { getDisplayedCash } from "../utils/getDisplayedCash";
import { tripCountLabel } from "../utils/tripCountLabel";

const LIVE_REFRESH_INTERVAL_MS = 10_000;

function WorkDayDetailPage() {
  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [deletionPassword, setDeletionPassword] = useState("");
  const [deletionConfirmation, setDeletionConfirmation] = useState("");
  const [deletionError, setDeletionError] = useState("");
  const deletingLockRef = useRef(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const loadWorkDayDetail = useCallback(async ({ silent = false } = {}) => {
    try {
      setError("");
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [workDayData, summaryData, tripsData] = await Promise.all([
        getWorkDayById(id),
        getWorkDaySummary(id),
        getTripsByWorkDay(id),
      ]);

      setWorkDay(workDayData);
      setSummary(summaryData);
      setTrips(tripsData);
      setLastUpdatedAt(new Date());
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadWorkDayDetail();
  }, [loadWorkDayDetail]);

  useEffect(() => {
    if (workDay?.status !== "OPEN" || workDay?.canManage !== false) {
      return undefined;
    }

    const intervalId = window.setInterval(
      () => loadWorkDayDetail({ silent: true }),
      LIVE_REFRESH_INTERVAL_MS
    );

    return () => window.clearInterval(intervalId);
  }, [loadWorkDayDetail, workDay?.canManage, workDay?.status]);

  const handleCopySummary = async () => {
    if (!workDay || !summary) {
      return;
    }

    const text = buildWorkDaySummaryText(workDay, summary);

    await copyTextToClipboard(text);

    setCopyMessage("Resumen copiado");

    setTimeout(() => {
      setCopyMessage("");
    }, 2500);
  };

  const handleDeleteWorkDay = async () => {
    if (deletingLockRef.current) {
      return;
    }

    deletingLockRef.current = true;
    setIsDeleting(true);

    try {
      setDeletionError("");

      if (deletionReason.trim().length < 5) {
        throw new Error("Explica el motivo con al menos 5 caracteres");
      }

      if (!deletionPassword) {
        throw new Error("Escribe tu contraseña actual");
      }

      if (deletionConfirmation.trim().toUpperCase() !== "ELIMINAR") {
        throw new Error("Escribe ELIMINAR para confirmar");
      }

      await deleteWorkDay(id, {
        correctionReason: deletionReason,
        correctionPassword: deletionPassword,
        deletionConfirmation,
      });
      navigate("/history");
    } catch (deleteError) {
      setDeletionError(deleteError.message);
    } finally {
      deletingLockRef.current = false;
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Detalle de jornada"
          subtitle="Cargando información..."
        />
        <Card>
          <p className="text-center text-slate-300">
            Cargando jornada...
          </p>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Detalle de jornada"
          subtitle="No pudimos cargar la información."
        />
        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            No se pudo cargar la jornada
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {error}
          </p>
          <div className="mt-5 space-y-3">
            <Button onClick={loadWorkDayDetail}>
              Reintentar
            </Button>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-[0.99]"
            >
              Volver al historial
            </button>
          </div>
        </Card>
      </section>
    );
  }

  if (!workDay || !summary) {
    return (
      <p className="text-slate-400">
        No se encontró la jornada solicitada.
      </p>
    );
  }

  const isLiveReadOnly =
    workDay.status === "OPEN" && workDay.canManage === false;

  if (isLiveReadOnly) {
    const sortedTrips = [...trips].sort(
      (left, right) =>
        new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
    );

    return (
      <section className="space-y-6">
        <SectionTitle
          title="Centro de control en vivo"
          subtitle={`${workDay.driverName || "Conductor"} · ${formatDate(workDay.date)} · Solo lectura`}
        />

        <Card className="border-emerald-500/30 bg-emerald-500/5" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">
                JORNADA EN CURSO
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {workDay.driverName || "Conductor"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Km inicial: {workDay.startKm}
              </p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
              <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              En vivo
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Viajes</p>
              <p className="mt-1 text-lg font-bold text-white">{summary.tripCount}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Facturación</p>
              <p className="mt-1 text-lg font-bold text-white">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Efectivo</p>
              <p className="mt-1 text-lg font-bold text-white">{formatCurrency(getDisplayedCash(summary))}</p>
              <p className="mt-1 text-xs text-slate-500">{tripCountLabel(summary.cashTripCount)}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Datáfono</p>
              <p className="mt-1 text-lg font-bold text-white">{formatCurrency(summary.card)}</p>
              <p className="mt-1 text-xs text-slate-500">{tripCountLabel(summary.cardTripCount)}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Comisiones</p>
              <p className="mt-1 text-lg font-bold text-white">{formatCurrency(summary.commission)}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Propinas</p>
              <p className="mt-1 text-lg font-bold text-white">{formatCurrency(summary.tip)}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500">
              {lastUpdatedAt
                ? `Actualizado a las ${lastUpdatedAt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
                : "Actualizando..."}
            </p>
            <button
              type="button"
              onClick={() => loadWorkDayDetail({ silent: true })}
              disabled={isRefreshing}
              className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 disabled:opacity-50"
            >
              {isRefreshing ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            TaxFin incorpora automáticamente cada viaje nuevo cada 10 segundos.
          </p>
        </Card>

        <Card>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-emerald-300">
                <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                ACTIVIDAD EN VIVO
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">Todos los viajes</h3>
            </div>
            <span className="text-sm font-bold text-slate-400">{summary.tripCount}</span>
          </div>

          {sortedTrips.length === 0 ? (
            <p className="mt-5 text-sm text-slate-400">Todavía no registró viajes.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-800 border-y border-slate-800">
              {sortedTrips.map((trip) => (
                <div key={trip.id} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        {trip.paymentType === "cash" ? "Efectivo" : "Datáfono"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(trip.createdAt).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-white">{formatCurrency(trip.amount)}</p>
                  </div>
                  {(Number(trip.commission || 0) > 0 || Number(trip.tip || 0) > 0) && (
                    <p className="mt-2 text-xs text-slate-400">
                      {Number(trip.commission || 0) > 0 && `Comisión${trip.commissionCompanyName ? ` · ${trip.commissionCompanyName}` : ""} ${formatCurrency(trip.commission)}`}
                      {Number(trip.commission || 0) > 0 && Number(trip.tip || 0) > 0 && " · "}
                      {Number(trip.tip || 0) > 0 && `Propina ${formatCurrency(trip.tip)}`}
                    </p>
                  )}
                  {trip.note && <p className="mt-2 text-xs text-slate-500">{trip.note}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="border-slate-800 bg-slate-900/40">
          <p className="text-sm text-slate-300">
            El resumen para compartir estará disponible cuando Matías cierre la jornada.
          </p>
        </Card>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300"
        >
          ← Volver al equipo
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Detalle de jornada"
        subtitle={`${formatDate(workDay.date)}${
          workDay.driverName ? ` · ${workDay.driverName}` : ""
        }`}
      />
      <div className="space-y-3">
        <WorkDayTicket
          workDay={workDay}
          summary={summary}
          trips={trips}
          onEditTrip={
            workDay.canCorrect
              ? (trip) => navigate(`/trips/${trip.id}/edit`)
              : null
          }
        />

        {workDay.status === "CLOSED" && (
          <WorkDayShareCard
            workDay={workDay}
            summary={summary}
            trips={trips}
            onCopySummary={handleCopySummary}
            copyMessage={copyMessage}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/history")}
        className="w-full rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-[0.99]"
      >
        ← Volver al historial
      </button>

      {workDay.canCorrect && workDay.status === "CLOSED" && (
        <Card>
          <h3 className="text-lg font-bold text-white">
            ¿Hay un dato incorrecto?
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Podés corregir la fecha, el combustible y los kilómetros con contraseña,
            motivo y registro de auditoría.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/work-days/${id}/edit`)}
            className="mt-5 w-full rounded-2xl border border-emerald-400/40 px-5 py-3 text-sm font-bold text-emerald-300"
          >
            Corregir datos de la jornada
          </button>
        </Card>
      )}

      {!workDay.isLocked && workDay.canManage !== false && (
        <Card className="border-red-500/30 bg-red-500/5">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="w-full rounded-2xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-50"
          >
            Eliminar jornada
          </button>
        </Card>
      )}

      {(workDay.isLocked || workDay.canManage === false) && (
        <p className="text-center text-xs text-slate-500">
          {workDay.canManage === false
            ? "Consulta de solo lectura"
            : "Jornada histórica protegida"}
        </p>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white">
              ¿Eliminar esta jornada?
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              Se eliminarán también todos sus viajes. Por seguridad, indica el motivo, confirma tu contraseña y escribe ELIMINAR.
            </p>
            <label className="mt-5 block text-sm font-semibold text-slate-200">
              Motivo de la eliminación
              <textarea
                value={deletionReason}
                onChange={(event) => setDeletionReason(event.target.value)}
                maxLength={500}
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                placeholder="Describe por qué necesitás eliminarla"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-200">
              Contraseña actual
              <input
                type="password"
                autoComplete="current-password"
                value={deletionPassword}
                onChange={(event) => setDeletionPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-200">
              Escribe ELIMINAR
              <input
                type="text"
                autoComplete="off"
                value={deletionConfirmation}
                onChange={(event) => setDeletionConfirmation(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
            </label>
            {deletionError && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {deletionError}
              </p>
            )}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleDeleteWorkDay}
                disabled={isDeleting}
                className="w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-bold text-white disabled:cursor-wait disabled:opacity-60"
              >
                {isDeleting
                  ? "Eliminando..."
                  : "Sí, eliminar jornada"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default WorkDayDetailPage;
