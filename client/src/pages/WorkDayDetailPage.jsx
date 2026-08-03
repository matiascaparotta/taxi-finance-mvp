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

function WorkDayDetailPage() {
  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletingLockRef = useRef(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const loadWorkDayDetail = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const [workDayData, summaryData, tripsData] = await Promise.all([
        getWorkDayById(id),
        getWorkDaySummary(id),
        getTripsByWorkDay(id),
      ]);

      setWorkDay(workDayData);
      setSummary(summaryData);
      setTrips(tripsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadWorkDayDetail();
  }, [loadWorkDayDetail]);

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
      setError("");
      await deleteWorkDay(id);
      navigate("/history");
    } catch (deleteError) {
      setError(deleteError.message);
      setShowDeleteConfirm(false);
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

        <WorkDayShareCard
          workDay={workDay}
          summary={summary}
          trips={trips}
          onCopySummary={handleCopySummary}
          copyMessage={copyMessage}
        />
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
            Podés corregir el combustible y los kilómetros con contraseña,
            motivo y registro de auditoría.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/work-days/${id}/edit`)}
            className="mt-5 w-full rounded-2xl border border-emerald-400/40 px-5 py-3 text-sm font-bold text-emerald-300"
          >
            Corregir combustible y kilómetros
          </button>
        </Card>
      )}

      {!workDay.isLocked && workDay.canManage !== false && (
        <Card className="border-red-500/30 bg-red-500/5">
          <h3 className="text-lg font-bold text-red-300">
            Eliminar jornada de prueba
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Eliminará la jornada completa y todos sus viajes.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="mt-5 w-full rounded-2xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-50"
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
              Se eliminarán también todos sus viajes. Esta acción no se puede deshacer.
            </p>
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
