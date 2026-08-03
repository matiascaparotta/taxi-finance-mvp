import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import {
  correctClosedWorkDay,
  getWorkDayById,
} from "../services/workDayService";

function EditWorkDayPage({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workDay, setWorkDay] = useState(null);
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [fuelAllocation, setFuelAllocation] = useState("OWN");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionPassword, setCorrectionPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isOwner = Boolean(
    currentUser?.roles?.isOwner ?? currentUser?.isOwner
  );

  const loadWorkDay = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);
      const data = await getWorkDayById(id);

      if (!data.canCorrect || data.status !== "CLOSED") {
        throw new Error("Esta jornada no admite correcciones");
      }

      setWorkDay(data);
      setStartKm(String(data.startKm));
      setEndKm(String(data.endKm));
      setFuelAmount(
        (Number(data.fuelOwn || 0) + Number(data.fuelJose || 0)).toFixed(2)
      );
      setFuelAllocation(Number(data.fuelJose || 0) > 0 ? "SHARED" : "OWN");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadWorkDay();
  }, [loadWorkDay]);

  const requestConfirmation = (event) => {
    event.preventDefault();
    setError("");

    if (correctionReason.trim().length < 5) {
      setError("Explica el motivo con al menos 5 caracteres");
      return;
    }

    if (!correctionPassword) {
      setError("Escribe tu contraseña actual");
      return;
    }

    setShowConfirm(true);
  };

  const saveCorrection = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setError("");
      await correctClosedWorkDay(id, {
        startKm,
        endKm,
        fuelAmount,
        fuelAllocation: isOwner ? "OWN" : fuelAllocation,
        correctionReason,
        correctionPassword,
      });
      navigate(`/work-days/${id}`);
    } catch (saveError) {
      setError(saveError.message);
      setShowConfirm(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-slate-300">Cargando jornada...</p>;
  }

  if (!workDay) {
    return (
      <Card className="border-red-500/30">
        <p className="text-red-300">{error || "Jornada no encontrada"}</p>
        <button
          type="button"
          onClick={() => navigate("/history")}
          className="mt-5 text-sm font-bold text-slate-300"
        >
          ← Volver al historial
        </button>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Corregir jornada"
        subtitle="Combustible y kilometraje · la fecha no cambiará"
      />

      <form onSubmit={requestConfirmation} className="space-y-5">
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm text-slate-300">
              Km inicial
              <input
                type="number"
                min="0"
                step="1"
                value={startKm}
                onChange={(event) => setStartKm(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
            </label>
            <label className="text-sm text-slate-300">
              Km final
              <input
                type="number"
                min="0"
                step="1"
                value={endKm}
                onChange={(event) => setEndKm(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm text-slate-300">
            Combustible total
            <input
              type="number"
              min="0"
              step="0.01"
              value={fuelAmount}
              onChange={(event) => setFuelAmount(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </label>

          {!isOwner && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["OWN", "Carga propia"],
                ["SHARED", "Compartida 50/50"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFuelAllocation(value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold ${
                    fuelAllocation === value
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                      : "border-slate-700 text-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <label className="block text-sm text-slate-300">
            Motivo de la corrección
            <textarea
              value={correctionReason}
              onChange={(event) => setCorrectionReason(event.target.value)}
              maxLength="500"
              rows="3"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              placeholder="Ej.: cargué mal el kilometraje final"
            />
          </label>
          <label className="mt-4 block text-sm text-slate-300">
            Contraseña actual
            <input
              type="password"
              value={correctionPassword}
              onChange={(event) => setCorrectionPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </label>
        </Card>

        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit">Revisar y guardar corrección</Button>
        <button
          type="button"
          onClick={() => navigate(`/work-days/${id}`)}
          className="w-full rounded-xl border border-slate-700 px-4 py-3 font-bold text-slate-300"
        >
          Cancelar
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-white">¿Guardar corrección?</h3>
            <p className="mt-3 text-sm text-slate-300">
              TaxFin validará la continuidad del vehículo y registrará los valores anteriores, los nuevos, el motivo y tu usuario.
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={saveCorrection}
                disabled={isSaving}
                className="w-full rounded-2xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Sí, guardar corrección"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isSaving}
                className="w-full rounded-2xl border border-slate-700 px-5 py-4 font-bold text-slate-300"
              >
                Volver a revisar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EditWorkDayPage;
