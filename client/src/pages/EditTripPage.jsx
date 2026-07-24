import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SectionTitle from "../components/ui/SectionTitle";
import TripForm from "../components/TripForm";
import Card from "../components/ui/Card";

import { deleteTrip, getTripById, updateTrip } from "../services/tripService";

function EditTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletingLockRef = useRef(false);

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    try {
      const tripData = await getTripById(id);
      setTrip(tripData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateTrip = async (tripData) => {
    await updateTrip(id, tripData);
    navigate("/");
  };

  const handleDeleteTrip = async () => {
    if (deletingLockRef.current || isUpdating) {
      return;
    }

    deletingLockRef.current = true;
    setIsDeleting(true);

    try {
      await deleteTrip(id);
      navigate("/");
    } catch (error) {
      setError(error.message);
      setShowDeleteConfirm(false);
    } finally {
      deletingLockRef.current = false;
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
        {error}
      </p>
    );
  }

  if (!trip) {
    return <p className="text-slate-400">Cargando viaje...</p>;
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Editar viaje"
        subtitle="Corrige el importe, método de pago, comisión, propina o nota."
      />

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

      <Card className="border-red-500/30 bg-red-500/10">
        <h3 className="text-lg font-bold text-red-300">Eliminar viaje</h3>

        <p className="mt-2 text-sm text-slate-300">
          Esta acción eliminará el viaje y actualizará automáticamente el resumen.
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
              Esta acción no se puede deshacer.
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
