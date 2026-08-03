import { useCallback, useEffect, useMemo, useState } from "react";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { getDrivers } from "../services/driverService";
import {
  closeMonthlySettlement,
  getMonthlySettlement,
  getMonthlySettlementHistory,
  updateMonthlySettings,
} from "../services/monthlySettlementService";
import { formatCurrency } from "../utils/formatCurrency";
import { isOwnerUser } from "../utils/userNavigation";
import { normalizeWorkDayDate } from "../utils/workDayDate";

const currentMonth = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  return `${parts.find((part) => part.type === "year").value}-${parts.find((part) => part.type === "month").value}`;
};

const monthLabel = (month) => {
  const [year, monthNumber] = month.split("-");
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${year}-${monthNumber}-01T00:00:00Z`));
};

const statusInfo = {
  IN_PROGRESS: ["En curso", "bg-emerald-500/15 text-emerald-300"],
  PENDING_REVIEW: ["Pendiente de revisar", "bg-amber-500/15 text-amber-300"],
  CLOSED: ["Cerrada", "bg-sky-500/15 text-sky-300"],
  EMPTY: ["Sin jornadas", "bg-slate-700 text-slate-300"],
};

function MoneyRow({ label, value, emphasis = false, detail = "" }) {
  return (
    <div className={`flex items-end justify-between gap-4 py-3 ${emphasis ? "text-white" : "text-slate-300"}`}>
      <div>
        <p className={emphasis ? "font-bold" : "text-sm"}>{label}</p>
        {detail && <p className="mt-0.5 text-xs text-slate-500">{detail}</p>}
      </div>
      <p className={`${emphasis ? "text-xl font-black" : "font-bold"}`}>{formatCurrency(value)}</p>
    </div>
  );
}

function MonthlySettlementPage({ currentUser = null }) {
  const owner = isOwnerUser(currentUser);
  const [driverId, setDriverId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [settlement, setSettlement] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showClose, setShowClose] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    if (!owner) return;
    getDrivers()
      .then((drivers) => {
        const managed = drivers.find(
          (driver) => driver.isDriver && !driver.isOwner && driver.status === "ACTIVE"
        );
        if (!managed) throw new Error("No hay un conductor activo para liquidar");
        setDriverId(managed.id);
      })
      .catch((loadError) => setError(loadError.message));
  }, [owner]);

  const load = useCallback(async () => {
    if (owner && !driverId) return;
    try {
      setIsLoading(true);
      setError("");
      const year = selectedMonth.slice(0, 4);
      const [detail, monthHistory] = await Promise.all([
        getMonthlySettlement(selectedMonth, driverId),
        getMonthlySettlementHistory(year, driverId),
      ]);
      setSettlement(detail);
      setHistory(monthHistory);
      setForm({
        socialSecurity: detail.settings.socialSecurity,
        payrollTransfer: detail.settings.payrollTransfer,
        expectedWorkDays: detail.settings.expectedWorkDays,
      });
    } catch (loadError) {
      setError(loadError.message || "No se pudo cargar la liquidación");
    } finally {
      setIsLoading(false);
    }
  }, [driverId, owner, selectedMonth]);

  useEffect(() => {
    load();
  }, [load]);

  const availableMonths = useMemo(() => {
    const months = new Set([currentMonth(), selectedMonth]);
    history.forEach((item) => months.add(item.month));
    return [...months].sort().reverse();
  }, [history, selectedMonth]);

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setError("");
      const updated = await updateMonthlySettings(selectedMonth, form, driverId);
      setSettlement(updated);
      setNotice("Datos mensuales revisados y guardados");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const closeMonth = async () => {
    try {
      setIsSaving(true);
      setError("");
      const updated = await closeMonthlySettlement(selectedMonth, confirmation);
      setSettlement(updated);
      setShowClose(false);
      setConfirmation("");
      setNotice("Liquidación cerrada. Los importes quedaron protegidos.");
    } catch (closeError) {
      setError(closeError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settlement || !form) {
    return <Card><p className="text-center text-slate-300">Preparando la liquidación mensual...</p>{error && <p className="mt-3 text-center text-red-300">{error}</p>}</Card>;
  }

  const calculation = settlement.calculation;
  const [statusText, statusClass] = statusInfo[settlement.status] || statusInfo.EMPTY;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          title="Liquidación mensual"
          subtitle={owner ? `Seguimiento de ${settlement.driver.displayName}` : "Tus cuentas con José, sin cálculos manuales"}
        />
        <select
          aria-label="Mes de la liquidación"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-bold capitalize text-white"
        >
          {availableMonths.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
        </select>
      </div>

      {notice && <Card className="border-emerald-500/30 bg-emerald-500/10"><p className="text-sm font-bold text-emerald-300">{notice}</p></Card>}
      {error && <Card className="border-red-500/30"><p className="text-sm text-red-300">{error}</p></Card>}

      <Card className="overflow-hidden border-emerald-500/25">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">{monthLabel(selectedMonth)}</p>
            <h2 className="mt-2 text-2xl font-black">{calculation.workedDays} jornadas cerradas</h2>
            <p className="mt-1 text-sm text-slate-400">Solo se contabilizan jornadas finalizadas.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{statusText}</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Facturación</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.rawRevenue)}</p></div>
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Efectivo</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.cashGenerated)}</p></div>
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Datáfono</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.cardGenerated)}</p></div>
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Promedio neto</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.averageDailyRevenue)}</p></div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">REPARTO</p>
          <MoneyRow label="Facturación de jornadas" value={calculation.rawRevenue} />
          <MoneyRow label="Gasolina de Matías" value={-calculation.fuelOwn} />
          <MoneyRow label="Facturación neta para reparto" value={calculation.netRevenueForSplit} emphasis />
          <MoneyRow
            label={settlement.status === "IN_PROGRESS" ? "Seguridad Social aplicada hasta hoy" : "Seguridad Social mensual"}
            value={-calculation.socialSecurityApplied}
            detail={settlement.status === "IN_PROGRESS" ? `${formatCurrency(calculation.dailySocialSecurity)} por jornada estimada` : "Se aplica completa aunque haya menos días trabajados"}
          />
          <MoneyRow label="Base a dividir" value={calculation.distributableBase} emphasis />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-4"><p className="text-xs text-emerald-300">50 % Matías</p><p className="mt-1 text-xl font-black">{formatCurrency(calculation.driverHalf)}</p></div>
            <div className="rounded-2xl bg-sky-500/10 p-4"><p className="text-xs text-sky-300">50 % José</p><p className="mt-1 text-xl font-black">{formatCurrency(calculation.ownerHalf)}</p></div>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-bold tracking-[0.16em] text-sky-300">CIERRE DE CAJA</p>
          <MoneyRow label="Efectivo generado" value={calculation.cashGenerated} />
          <MoneyRow label="Gasolina de Matías" value={-calculation.fuelOwn} />
          <MoneyRow label="Gasolina de José" value={-calculation.fuelJose} />
          <MoneyRow label="Efectivo disponible" value={calculation.cashAvailable} emphasis />
          <MoneyRow label="Parte de Matías" value={calculation.driverHalf} />
          <MoneyRow label="Nómina ya transferida" value={-calculation.payrollTransfer} />
          <MoneyRow label="Pendiente para Matías" value={calculation.pendingForDriver} emphasis />
          <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <p className="text-sm font-bold text-emerald-300">
              {calculation.deliveryToOwner >= 0
                ? "Matías entrega a José"
                : "José entrega a Matías"}
            </p>
            <p className="mt-1 text-3xl font-black">{formatCurrency(Math.abs(calculation.deliveryToOwner))}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div><h3 className="text-lg font-bold">Datos del mes</h3><p className="mt-1 text-sm text-slate-400">Matías y José pueden revisarlos; ambos ven siempre el mismo registro.</p></div>
          {settlement.settings.settingsConfirmed && <span className="text-xs font-bold text-emerald-300">Revisados ✓</span>}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold">Seguridad Social<input type="number" min="0" step="0.01" disabled={!settlement.canEditSettings} value={form.socialSecurity} onChange={(e) => setForm({ ...form, socialSecurity: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:opacity-60" /></label>
          <label className="text-sm font-semibold">Nómina transferida<input type="number" min="0" step="0.01" disabled={!settlement.canEditSettings} value={form.payrollTransfer} onChange={(e) => setForm({ ...form, payrollTransfer: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:opacity-60" /></label>
          <label className="text-sm font-semibold">Días laborables previstos<input type="number" min="1" max="31" step="1" disabled={!settlement.canEditSettings} value={form.expectedWorkDays} onChange={(e) => setForm({ ...form, expectedWorkDays: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:opacity-60" /></label>
        </div>
        {settlement.canEditSettings && <button type="button" disabled={isSaving} onClick={saveSettings} className="mt-5 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 disabled:opacity-50">{isSaving ? "Guardando..." : "Guardar y marcar como revisados"}</button>}
      </Card>

      <Card>
        <h3 className="text-lg font-bold">Jornadas incluidas</h3>
        {settlement.days.length === 0 ? <p className="mt-3 text-sm text-slate-400">Todavía no hay jornadas cerradas en este mes.</p> : (
          <div className="mt-4 divide-y divide-slate-800">
            {settlement.days.map((day) => {
              const normalizedDate = normalizeWorkDayDate(day.date);

              return <div key={day.workDayId} className="flex items-center justify-between gap-4 py-3"><div><p className="font-bold">{new Date(`${normalizedDate}T12:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</p><p className="text-xs text-slate-500">{day.tripCount} viajes · gasolina {formatCurrency(day.fuelOwn)}</p></div><p className="font-black">{formatCurrency(day.netRevenue)}</p></div>;
            })}
          </div>
        )}
      </Card>

      {!owner && settlement.canClose && <button type="button" onClick={() => setShowClose(true)} className="w-full rounded-2xl border border-sky-500/50 bg-sky-500/10 px-5 py-4 font-bold text-sky-200">Cerrar liquidación del mes</button>}
      {owner && settlement.status !== "CLOSED" && <p className="text-center text-sm text-slate-500">José puede revisar los datos. El cierre definitivo lo confirma Matías.</p>}

      {showClose && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5"><div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6"><h3 className="text-xl font-black">Cerrar {monthLabel(selectedMonth)}</h3><p className="mt-3 text-sm text-slate-300">Los importes quedarán protegidos como una fotografía definitiva del mes.</p><label className="mt-5 block text-sm font-bold">Escribe CERRAR<input value={confirmation} onChange={(e) => setConfirmation(e.target.value.toUpperCase())} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" /></label><button type="button" disabled={isSaving} onClick={closeMonth} className="mt-5 w-full rounded-2xl bg-sky-400 px-5 py-4 font-black text-slate-950 disabled:opacity-50">Confirmar cierre</button><button type="button" onClick={() => setShowClose(false)} className="mt-3 w-full rounded-2xl border border-slate-700 px-5 py-4 font-bold">Volver</button></div></div>}
    </section>
  );
}

export default MonthlySettlementPage;
