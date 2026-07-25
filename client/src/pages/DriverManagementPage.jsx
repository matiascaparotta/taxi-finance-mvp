import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import {
  createDriver,
  getDrivers,
  resetDriverPassword,
  updateDriverStatus,
} from "../services/driverService";
import { copyTextToClipboard } from "../utils/copyTextToClipboard";

const EMPTY_FORM = {
  displayName: "",
  username: "",
  fuelCalculationMode: "ACTUAL_LOAD",
  fuelRatePerKm: "",
};

function DriverManagementPage() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [createdAccess, setCreatedAccess] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const loadDrivers = useCallback(async () => {
    try {
      setError("");
      setDrivers(await getDrivers());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const updateField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");
      setCreatedAccess(null);
      setIsSaving(true);
      const result = await createDriver(form);
      setCreatedAccess({
        username: result.driver.username,
        temporaryPassword: result.temporaryPassword,
      });
      setForm(EMPTY_FORM);
      await loadDrivers();
    } catch (createError) {
      setError(createError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (driver) => {
    const nextStatus =
      driver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    if (
      nextStatus === "INACTIVE" &&
      !window.confirm(
        `¿Suspender el acceso de ${driver.displayName}? No podrá ingresar hasta que lo reactives.`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setUpdatingId(driver.id);
      await updateDriverStatus(driver.id, nextStatus);
      setMessage(
        nextStatus === "ACTIVE"
          ? `${driver.displayName} puede volver a ingresar.`
          : `${driver.displayName} quedó suspendido.`
      );
      await loadDrivers();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyAccess = async () => {
    await copyTextToClipboard(
      `Usuario: ${createdAccess.username}\nContraseña temporal: ${createdAccess.temporaryPassword}`
    );
    setMessage("Acceso temporal copiado");
  };

  const handleResetPassword = async (driver) => {
    if (
      !window.confirm(
        `¿Generar una contraseña temporal nueva para ${driver.displayName}? La contraseña anterior dejará de funcionar.`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setCreatedAccess(null);
      setUpdatingId(driver.id);
      const result = await resetDriverPassword(driver.id);
      setCreatedAccess({
        username: driver.username,
        temporaryPassword: result.temporaryPassword,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Gestionar conductores"
        subtitle="Crea accesos y controla quién puede ingresar"
      />

      <button
        type="button"
        onClick={() => navigate("/")}
        className="w-full rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:text-white"
      >
        ← Volver al inicio
      </button>

      {createdAccess && (
        <Card className="border-emerald-500/40 bg-emerald-500/10">
          <p className="text-sm font-bold text-emerald-300">
            ACCESO CREADO
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Entrega estos datos al conductor
          </h2>
          <div className="mt-4 space-y-2 rounded-xl bg-slate-950/70 p-4">
            <p className="text-sm text-slate-300">
              Usuario:{" "}
              <strong className="text-white">
                {createdAccess.username}
              </strong>
            </p>
            <p className="break-all text-sm text-slate-300">
              Contraseña temporal:{" "}
              <strong className="text-white">
                {createdAccess.temporaryPassword}
              </strong>
            </p>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Esta contraseña se muestra una sola vez y deberá cambiarse al
            iniciar sesión.
          </p>
          <button
            type="button"
            onClick={handleCopyAccess}
            className="mt-4 w-full rounded-xl border border-emerald-500/40 px-4 py-3 text-sm font-bold text-emerald-300"
          >
            Copiar usuario y contraseña
          </button>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-bold text-white">
          Nuevo conductor
        </h2>
        <form onSubmit={handleCreate} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Nombre completo
            </label>
            <input
              value={form.displayName}
              onChange={(event) =>
                updateField("displayName", event.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Nombre de usuario
            </label>
            <input
              value={form.username}
              onChange={(event) =>
                updateField("username", event.target.value.toLowerCase())
              }
              required
              autoCapitalize="none"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
            <p className="mt-2 text-xs text-slate-500">
              Ejemplo: nombre.apellido
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Cálculo del combustible
            </label>
            <select
              value={form.fuelCalculationMode}
              onChange={(event) =>
                updateField("fuelCalculationMode", event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            >
              <option value="ACTUAL_LOAD">Carga real</option>
              <option value="DISTANCE_RATE">
                Tarifa por kilómetro
              </option>
            </select>
          </div>

          {form.fuelCalculationMode === "DISTANCE_RATE" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Euros por kilómetro
              </label>
              <input
                type="number"
                min="0.0001"
                step="0.0001"
                value={form.fuelRatePerKm}
                onChange={(event) =>
                  updateField("fuelRatePerKm", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Creando..." : "Crear conductor"}
          </Button>
        </form>
      </Card>

      {(error || message) && (
        <p
          className={`rounded-xl border p-3 text-sm ${
            error
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {error || message}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Conductores</h2>
        {isLoading ? (
          <Card>
            <p className="text-center text-slate-300">
              Cargando conductores...
            </p>
          </Card>
        ) : drivers.length === 0 ? (
          <Card>
            <p className="text-center text-slate-300">
              Todavía no hay conductores.
            </p>
          </Card>
        ) : (
          drivers.map((driver) => (
            <Card key={driver.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white">
                    {driver.displayName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    @{driver.username}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {driver.fuelCalculationMode === "DISTANCE_RATE"
                      ? `${driver.fuelRatePerKm} €/km`
                      : "Combustible por carga real"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    driver.status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {driver.status === "ACTIVE" ? "Activo" : "Suspendido"}
                </span>
              </div>

              {!driver.isOwner && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleResetPassword(driver)}
                    disabled={updatingId === driver.id}
                    className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 disabled:cursor-wait disabled:opacity-50"
                  >
                    Nueva contraseña
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(driver)}
                    disabled={updatingId === driver.id}
                    className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 disabled:cursor-wait disabled:opacity-50"
                  >
                    {updatingId === driver.id
                      ? "Actualizando..."
                      : driver.status === "ACTIVE"
                        ? "Suspender acceso"
                        : "Reactivar acceso"}
                  </button>
                </div>
              )}
            </Card>
          ))
        )}
      </section>
    </section>
  );
}

export default DriverManagementPage;
