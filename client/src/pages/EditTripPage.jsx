import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import SectionTitle from "../components/ui/SectionTitle";
import TripForm from "../components/TripForm";
import Card from "../components/ui/Card";

import { deleteTrip, getTripById, updateTrip } from "../services/tripService";
import { getWorkDayById } from "../services/workDayService";

function EditTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [workDay, setWorkDay] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [correctionPassword, setCorrectionPassword] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const deletingLockRef = useRef(false);

  const loadTrip = useCallback(async () => {
    try {
      setLoadError("");
      setIsLoading(true);

      const tripData = await getTripById(id);
      const workDayData = await getWorkDayById(tripData.workDayId);
      setTrip(tripData);
      setWorkDay(workDayData);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const handleUpdateTrip = async (tripData) => {
    const isClosedWorkDay = workDay?.status === "CLOSED";

    if (isClosedWorkDay && correctionReason.trim().length < 5) {
      throw new Error(
        "Explica el motivo de la corrección con al menos 5 caracteres"
      );
    }

    if (isClosedWorkDay && !correctionPassword) {
      throw new Error("Escribe tu contraseña actual");
    }

    await updateTrip(id, {
      ...tripData,
      ...(isClosedWorkDay
        ? {
            correctionPassword,
            correctionReason,
          }
        : {}),
    });
    navigate(
      isClosedWorkDay
        ? `/work-day-closed/${workDay.id}`
        : "/"
    );
  };

  const handleDeleteTrip = async () => {
    if (deletingLockRef.current || isUpdating) {
      return;
    }

    deletingLockRef.current = true;
    setIsDeleting(true);

    try {
      setActionError("");
      const isClosedWorkDay = workDay?.status === "CLOSED";

      if (isClosedWorkDay && correctionReason.trim().length < 5) {
        throw new Error(
          "Explica el motivo de la eliminación con al menos 5 caracteres"
        );
      }

      if (isClosedWorkDay && !correctionPassword) {
        throw new Error("Escribe tu contraseña actual");
      }

      await deleteTrip(
        id,
        isClosedWorkDay
          ? {
              correctionPassword,
              correctionReason,
            }
          : {}
      );
      navigate(
        isClosedWorkDay
          ? `/work-day-closed/${workDay.id}`
          : "/"
      );
    } catch (error) {
      setActionError(error.message);
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
          title="Editar viaje"
          subtitle="Cargando información..."
        />
        <Card>
          <p className="text-center text-slate-300">
            Cargando viaje...
          </p>
        </Card>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Editar viaje"
          subtitle="No pudimos cargar la información."
        />
        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            No se pudo cargar el viaje
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {loadError}
          </p>
          <div className="mt-5 space-y-3">
            <Button onClick={loadTrip}>
              Reintentar
            </Button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-[0.99]"
            >
              Volver a la jornada
            </button>
          </div>
        </Card>
      </section>
    );
  }

  if (!trip) {
    return null;
  }

  const isClosedWorkDay = workDay?.status === "CLOSED";

  return (
    <section className="space-y-8">
      <SectionTitle
        title={isClosedWorkDay ? "Corregir viaje" : "Editar viaje"}
        subtitle={
          isClosedWorkDay
            ? "La jornada está cerrada. La corrección quedará registrada."
            : "Corrige el importe, método de pago, comisión, propina o nota."
        }
      />

      {isClosedWorkDay && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <h3 className="text-lg font-bold text-amber-200">
            Confirmación de seguridad
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Escribe el motivo y tu contraseña. TaxFin guardará quién hizo el cambio, cuándo y qué valores había antes y después.
          </p>

          <label className="mt-5 block text-sm font-semibold text-slate-200">
            Motivo de la corrección
            <textarea
              value={correctionReason}
              onChange={(event) => setCorrectionReason(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Ej.: importe cargado por error"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-200">
            Contraseña actual
            <input
              type="password"
              autoComplete="current-password"
              value={correctionPassword}
              onChange={(event) => setCorrectionPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400"
            />
          </label>
        </Card>
      )}

      <TripForm
        initialAmount={trip.amount}
        initialPaymentType={trip.paymentType}
        initialCommission={trip.commission}
        initialTip={trip.tip}
        initialNote={trip.note}
        submitLabel="Guardar cambios"
        loadingLabel="Guardando cambios..."
        onSubmit={handleUpdateTrip}
        disabled={isDeleting}
        onSavingChange={setIsUpdating}
      />

      {actionError && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {actionError}
        </p>
      )}

      <Card className="border-red-500/30 bg-red-500/10">
        <h3 className="text-lg font-bold text-red-300">Eliminar viaje</h3>

        <p className="mt-2 text-sm text-slate-300">
          {isClosedWorkDay
            ? "Se eliminará el viaje, se recalculará el resumen y quedará una auditoría permanente."
            : "Esta acción eliminará el viaje y actualizará automáticamente el resumen."}
        </p>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isUpdating || isDeleting}
          className="mt-5 w-full rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-4 text-lg font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50"
        >
          Eliminar viaje
        </button>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white">¿Eliminar viaje?</h3>

            <p className="mt-3 text-sm text-slate-300">
              {isClosedWorkDay
                ? "Confirma que deseas eliminarlo. TaxFin registrará el motivo, el usuario y todos los datos que tenía el viaje."
                : "Esta acción no se puede deshacer."}
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleDeleteTrip}
                disabled={isDeleting}
                className="w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-bold text-white disabled:cursor-wait disabled:opacity-60"
              >
                {isDeleting
                  ? "Eliminando..."
                  : "Sí, eliminar viaje"}
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
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

export default EditTripPage;
