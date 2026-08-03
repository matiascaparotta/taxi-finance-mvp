import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../components/ui/SectionTitle";
import WorkDaySummaryCard from "../components/WorkDaySummaryCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatCurrency } from "../utils/formatCurrency";

import { closeWorkDay, getOpenWorkDay } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { calculateFuelSplit } from "../utils/calculateFuelSplit";
import {
  getCloseDateOptions,
  normalizeWorkDayDate,
} from "../utils/workDayDate";

function CloseWorkDayPage({ currentUser }) {
  const [openWorkDay, setOpenWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [fuelAmount, setFuelAmount] = useState("0");
  const [fuelAllocation, setFuelAllocation] = useState("OWN");
  const [endKm, setEndKm] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingLockRef = useRef(false);

  const navigate = useNavigate();
  const isOwner = Boolean(
    currentUser?.roles?.isOwner ?? currentUser?.isOwner
  );
  const distanceFuelMode =
    currentUser?.fuelCalculationMode === "DISTANCE_RATE";
  const fuelRatePerKm = Number(currentUser?.fuelRatePerKm || 0);
  const effectiveFuelAllocation = isOwner
    ? "OWN"
    : fuelAllocation;

  const loadCloseData = useCallback(async () => {
    try {
      setLoadError("");
      setIsLoading(true);

      const openWorkDayData = await getOpenWorkDay();

      if (!openWorkDayData) {
        navigate("/");
        return;
      }

      const summaryData = await getWorkDaySummary(openWorkDayData.id);
      const dateOptions = getCloseDateOptions();
      const currentDate = normalizeWorkDayDate(openWorkDayData.date);

      setOpenWorkDay(openWorkDayData);
      setSummary(summaryData);
      setSelectedDate(
        currentDate === dateOptions.today ||
          currentDate === dateOptions.yesterday
          ? currentDate
          : ""
      );
    } catch (error) {
      console.error(error);
      setLoadError(
        error.message ||
          "No se pudo cargar la jornada activa"
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadCloseData();
  }, [loadCloseData]);

  const workedKm =
    openWorkDay && endKm
      ? Number(endKm) - Number(openWorkDay.startKm)
      : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!selectedDate) {
      setError("Confirma si la jornada corresponde a hoy o ayer");
      return;
    }

    if (!endKm) {
      setError("El kilometraje final es obligatorio");
      return;
    }

    if (workedKm < 0) {
      setError("El kilometraje final no puede ser menor al inicial");
      return;
    }

    if (!distanceFuelMode && !/^\d+(?:\.\d{1,2})?$/.test(fuelAmount)) {
      setError("Introduce un importe de combustible válido, con hasta 2 decimales");
      return;
    }

    setShowConfirm(true);
  };

  const confirmCloseWorkDay = async () => {
    if (closingLockRef.current) {
      return;
    }

    closingLockRef.current = true;
    setIsClosing(true);

    try {
      setError("");

      const closedWorkDay = await closeWorkDay(openWorkDay.id, {
        date: selectedDate,
        endKm,
        fuelAmount,
        fuelAllocation: effectiveFuelAllocation,
      });

      navigate(`/work-day-closed/${closedWorkDay.id}`);
    } catch (error) {
      setError(error.message);
      setShowConfirm(false);
    } finally {
      closingLockRef.current = false;
      setIsClosing(false);
    }
  };

  const dateOptions = getCloseDateOptions();
  const fuelSplit = calculateFuelSplit(
    distanceFuelMode && workedKm !== null
      ? (workedKm * fuelRatePerKm).toFixed(2)
      : fuelAmount,
    distanceFuelMode ? "OWN" : effectiveFuelAllocation
  );

  if (isLoading) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Finalizar jornada"
          subtitle="Revisa la información antes de cerrar el turno."
        />
        <Card>
          <p className="text-center text-slate-300">
            Cargando jornada...
          </p>
        </Card>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="space-y-8">
        <SectionTitle
          title="Finalizar jornada"
          subtitle="No pudimos preparar el cierre."
        />
        <Card className="border-red-500/30">
          <p className="font-bold text-white">
            No se pudo cargar la jornada
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {loadError}
          </p>
          <div className="mt-5 space-y-3">
            <Button onClick={loadCloseData}>
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

  if (!openWorkDay || !summary) {
    return null;
  }

  return (
    <section className="space-y-8">
      <SectionTitle title="Finalizar jornada" subtitle="Revisa la información antes de cerrar el turno." />

      <WorkDaySummaryCard summary={summary} />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="mb-3 block text-sm text-slate-300">
              ¿A qué día corresponde esta jornada?
            </legend>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Hoy", value: dateOptions.today },
                { label: "Ayer", value: dateOptions.yesterday },
              ].map((option) => {
                const isSelected = selectedDate === option.value;

                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-2xl border p-4 text-center transition ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-400/10"
                        : "border-slate-700 bg-slate-950/60 hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="workDayDate"
                      value={option.value}
                      checked={isSelected}
                      onChange={(event) => setSelectedDate(event.target.value)}
                      className="sr-only"
                    />
                    <span
                      className={`block text-lg font-bold ${
                        isSelected ? "text-emerald-300" : "text-white"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {option.value.split("-").reverse().join("/")}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {openWorkDay && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Kilometraje inicial</p>
              <p className="mt-1 text-xl font-bold text-white">{openWorkDay.startKm} km</p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            {distanceFuelMode ? (
              <div>
                <p className="text-sm font-medium text-slate-200">⛽ Combustible por kilómetros</p>
                <p className="mt-2 text-2xl font-black text-white">
                  {workedKm === null ? "Pendiente de kilometraje final" : formatCurrency(workedKm * fuelRatePerKm)}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {workedKm === null ? `Tarifa configurada: ${fuelRatePerKm.toFixed(2)} €/km` : `${workedKm} km × ${fuelRatePerKm.toFixed(2)} €/km`}
                </p>
              </div>
            ) : <>
            <label
              htmlFor="fuelAmount"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              ⛽ Importe cargado
            </label>
            <input
              id="fuelAmount"
              name="fuelAmount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={fuelAmount}
              onChange={(event) => setFuelAmount(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
            />
            <p className="mt-2 text-xs text-slate-400">
              Si no cargaste combustible, deja el importe en 0 €.
            </p>

            {isOwner ? (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                <p className="font-bold text-white">
                  Gasolina propia
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  La carga completa se guardará como gasto del propietario.
                </p>
              </div>
            ) : (
              <fieldset className="mt-5">
                <legend className="mb-3 text-sm text-slate-300">
                  ¿Cómo corresponde esta carga?
                </legend>

                <div className="space-y-3">
                  {[
                    {
                      label: "Toda mía",
                      description: "La carga completa corresponde al conductor.",
                      value: "OWN",
                    },
                    {
                      label: "Compartida 50 %",
                      description:
                        "La mitad corresponde al conductor y la otra mitad al propietario.",
                      value: "SHARED",
                    },
                  ].map((option) => {
                    const isSelected = fuelAllocation === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                          isSelected
                            ? "border-emerald-400 bg-emerald-400/10"
                            : "border-slate-700 bg-slate-950 hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="fuelAllocation"
                          value={option.value}
                          checked={isSelected}
                          onChange={(event) =>
                            setFuelAllocation(event.target.value)
                          }
                          className="mt-1 accent-emerald-400"
                        />
                        <span>
                          <span
                            className={`block font-bold ${
                              isSelected ? "text-emerald-300" : "text-white"
                            }`}
                          >
                            {option.label}
                          </span>
                          <span className="mt-1 block text-xs text-slate-400">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {fuelSplit && Number(fuelAmount) > 0 && (
              <div
                className={`mt-4 grid gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 ${
                  isOwner ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                <div>
                  <p className="text-xs text-emerald-300">
                    Gasolina propia
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {formatCurrency(fuelSplit.fuelOwn)}
                  </p>
                </div>
                {!isOwner && (
                  <div>
                    <p className="text-xs text-emerald-300">
                      Gasolina José
                    </p>
                    <p className="mt-1 font-bold text-white">
                      {formatCurrency(fuelSplit.fuelJose)}
                    </p>
                  </div>
                )}
              </div>
            )}
            </>}
          </div>

          <div>
            <label htmlFor="endKm" className="mb-2 block text-sm text-slate-300">Kilometraje final</label>
            <input id="endKm" type="number" value={endKm} onChange={(e)=>setEndKm(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500" />
          </div>

          {workedKm !== null && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-300">Kilómetros trabajados</p>
              <p className="mt-1 text-2xl font-bold text-white">{workedKm} km</p>
            </div>
          )}

          {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

          <Button type="submit">Confirmar cierre</Button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-[0.99]"
          >
            Volver a la jornada
          </button>
        </form>
      </Card>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white">¿Cerrar jornada?</h3>
            <p className="mt-3 text-sm text-slate-300">Esta acción cerrará el turno y cambiará la jornada a estado CLOSED.</p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={confirmCloseWorkDay}
                disabled={isClosing}
                className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-bold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
              >
                {isClosing ? "Cerrando..." : "Sí, cerrar jornada"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isClosing}
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

export default CloseWorkDayPage;
