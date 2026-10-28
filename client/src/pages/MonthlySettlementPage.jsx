import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "../components/ui/Card";
import MonthlySettlementShareButton from "../components/MonthlySettlementShareButton";
import OwnerScopeSelector from "../components/OwnerScopeSelector";
import SectionTitle from "../components/ui/SectionTitle";
import { getDrivers } from "../services/driverService";
import {
  closeMonthlySettlement,
  getMonthlySettlement,
  getMonthlySettlementHistory,
  updateMonthlySettings,
} from "../services/monthlySettlementService";
import { formatCurrency } from "../utils/formatCurrency";
import { isOwnerUser, isSalariedDriverUser } from "../utils/userNavigation";
import { normalizeWorkDayDate } from "../utils/workDayDate";
import {
  buildDailyMonthlyComparison,
  getPreviousCalendarMonth,
} from "../utils/monthlyComparison";
import { buildOwnerMonthlyOverview } from "../utils/ownerMonthlyOverview";

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

function OwnerMonthlyOverview({
  currentUser,
  drivers,
  overview,
  selectedMonth,
  availableMonths,
  onMonthChange,
  onDriverChange,
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          title="Resumen de la empresa"
          subtitle="Una vista simple de David y todos sus conductores"
        />
        <select
          aria-label="Mes del resumen de empresa"
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-bold capitalize text-white"
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>{monthLabel(month)}</option>
          ))}
        </select>
      </div>

      <Card>
        <OwnerScopeSelector
          currentUser={currentUser}
          drivers={drivers}
          value="all"
          onChange={onDriverChange}
        />
      </Card>

      <Card className="overflow-hidden border-emerald-500/30">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
          TOTAL DE {monthLabel(selectedMonth).toUpperCase()}
        </p>
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-slate-950 p-5">
          <p className="text-sm font-bold text-emerald-200">Facturación conjunta</p>
          <p className="mt-2 text-4xl font-black text-white">
            {formatCurrency(overview.totals.revenue)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {overview.totals.workedDays} jornadas cerradas entre todo el equipo
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Efectivo</p><p className="mt-1 text-lg font-black">{formatCurrency(overview.totals.cash)}</p></div>
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Datáfono</p><p className="mt-1 text-lg font-black">{formatCurrency(overview.totals.card)}</p></div>
          <div className="rounded-2xl bg-sky-500/10 p-4"><p className="text-xs text-sky-300">Gasolina</p><p className="mt-1 text-lg font-black">{formatCurrency(overview.totals.fuel)}</p></div>
          <div className="rounded-2xl bg-amber-500/10 p-4"><p className="text-xs text-amber-300">Comisiones</p><p className="mt-1 text-lg font-black">{formatCurrency(overview.totals.commission)}</p></div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-black text-white">Detalle por persona</h2>
        <p className="mt-1 text-sm text-slate-400">
          Tocá una tarjeta para ver su mes completo.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {overview.rows.map((row) => {
            const mine = String(row.driver.id) === String(currentUser?.id);
            return (
              <button
                key={row.driver.id}
                type="button"
                onClick={() => onDriverChange(String(row.driver.id))}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:border-emerald-500/40 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-300">
                      {mine ? "MIS DATOS" : "CONDUCTOR"}
                    </p>
                    <h3 className="mt-1 text-xl font-black text-white">
                      {mine ? "David" : row.driver.displayName}
                    </h3>
                  </div>
                  <span className="text-xl text-slate-500">→</span>
                </div>
                <p className="mt-5 text-sm text-slate-400">Facturación</p>
                <p className="mt-1 text-3xl font-black text-white">
                  {formatCurrency(row.revenue)}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-sm">
                  <span className="text-slate-400">{row.workedDays} jornadas</span>
                  <span className="font-bold text-emerald-300">Ver detalle</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OwnerDriverMonthlyDetail({
  currentUser,
  drivers,
  settlement,
  selectedMonth,
  availableMonths,
  selectedDriverId,
  onDriverChange,
  onMonthChange,
}) {
  const calculation = settlement.calculation;
  const dailyMonth = settlement.dailySettlementMonth;
  const mine = String(settlement.driver.id) === String(currentUser?.id);

  return (
    <section className="space-y-6">
      <Card>
        <OwnerScopeSelector
          currentUser={currentUser}
          drivers={drivers}
          value={String(selectedDriverId)}
          onChange={onDriverChange}
        />
      </Card>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          title={mine ? "Mi resumen mensual" : `Resumen de ${settlement.driver.displayName}`}
          subtitle={mine ? "Tu actividad como conductor" : "Detalle individual del conductor"}
        />
        <select
          aria-label="Mes del detalle"
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-bold capitalize text-white"
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>{monthLabel(month)}</option>
          ))}
        </select>
      </div>

      <Card className="border-emerald-500/25">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
          {monthLabel(selectedMonth)}
        </p>
        <p className="mt-2 text-sm text-slate-400">Facturación</p>
        <p className="mt-1 text-4xl font-black text-white">
          {formatCurrency(calculation.rawRevenue)}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Jornadas</p><p className="mt-1 text-xl font-black">{calculation.workedDays}</p></div>
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Efectivo</p><p className="mt-1 text-xl font-black">{formatCurrency(calculation.cashGenerated)}</p></div>
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Datáfono</p><p className="mt-1 text-xl font-black">{formatCurrency(calculation.cardGenerated)}</p></div>
          <div className="rounded-2xl bg-sky-500/10 p-4"><p className="text-xs text-sky-300">Gasolina</p><p className="mt-1 text-xl font-black">{formatCurrency(calculation.fuelOwn)}</p></div>
        </div>
      </Card>

      <Card className="border-amber-500/25 bg-amber-500/5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
          PROPINA PERSONAL DEL MES
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {formatCurrency(settlement.salariedMetrics?.tip)}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Suma de las propinas registradas en las jornadas de {settlement.driver.displayName}. No se incluye en los archivos compartidos.
        </p>
      </Card>

      {dailyMonth ? (
        <Card className="border-sky-500/25">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">
            REPARTO DEL MES
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-4">
              <p className="text-xs text-emerald-300">Para {settlement.driver.displayName}</p>
              <p className="mt-1 text-2xl font-black">{formatCurrency(dailyMonth.driverShare)}</p>
            </div>
            <div className="rounded-2xl bg-sky-500/10 p-4">
              <p className="text-xs text-sky-300">Para David</p>
              <p className="mt-1 text-2xl font-black">{formatCurrency(dailyMonth.ownerShare)}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-700 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-bold text-white">
                {dailyMonth.pendingBalance > 0
                  ? "David debe pagarle"
                  : dailyMonth.pendingBalance < 0
                    ? "Debe entregar a David"
                    : "Todo saldado"}
              </p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(Math.abs(dailyMonth.pendingBalance))}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <MoneyRow label="Facturación" value={calculation.rawRevenue} />
          <MoneyRow label="Gasolina" value={-calculation.fuelOwn} />
          <MoneyRow label="Resultado después de gasolina" value={calculation.netRevenueForSplit} emphasis />
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-black text-white">Jornadas del mes</h3>
        {settlement.days.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No hay jornadas cerradas este mes.</p>
        ) : (
          <div className="mt-4 divide-y divide-slate-800">
            {settlement.days.map((day) => {
              const normalizedDate = normalizeWorkDayDate(day.date);
              return (
                <div key={day.workDayId} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-bold text-white">
                      {new Date(`${normalizedDate}T12:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{day.tripCount} viajes</p>
                    <p className="mt-1 text-xs font-bold text-amber-300">Propina personal: {formatCurrency(day.tip)}</p>
                  </div>
                  <p className="text-lg font-black text-white">{formatCurrency(day.totalRevenue)}</p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </section>
  );
}

function MonthlySettlementPage({ currentUser = null }) {
  const owner = isOwnerUser(currentUser);
  const salariedDriver = isSalariedDriverUser(currentUser);
  const [searchParams, setSearchParams] = useSearchParams();
  const [driverId, setDriverId] = useState(
    owner ? searchParams.get("driver") || "all" : null
  );
  const [drivers, setDrivers] = useState([]);
  const [ownerOverview, setOwnerOverview] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [settlement, setSettlement] = useState(null);
  const [history, setHistory] = useState([]);
  const [previousSettlement, setPreviousSettlement] = useState(null);
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showClose, setShowClose] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [showMonthSettings, setShowMonthSettings] = useState(false);

  const selectDriver = (value) => {
    setDriverId(value);
    setSearchParams(value === "all" ? {} : { driver: value });
  };

  useEffect(() => {
    if (!owner) return;
    getDrivers()
      .then((drivers) => {
        const activeDrivers = drivers.filter(
          (driver) => driver.isDriver && driver.status === "ACTIVE"
        );
        if (!activeDrivers.length) throw new Error("No hay conductores activos");
        setDrivers(activeDrivers);
      })
      .catch((loadError) => {
        setError(loadError.message);
        setIsLoading(false);
      });
  }, [owner]);

  const load = useCallback(async () => {
    if (owner && (!driverId || !drivers.length)) return;
    try {
      setIsLoading(true);
      setError("");

      if (owner && driverId === "all") {
        const [details, histories] = await Promise.all([
          Promise.all(
            drivers.map((driver) =>
              getMonthlySettlement(selectedMonth, driver.id)
            )
          ),
          Promise.all(
            drivers.map((driver) => getMonthlySettlementHistory(driver.id))
          ),
        ]);
        setOwnerOverview(buildOwnerMonthlyOverview(details));
        setHistory([...new Set(histories.flat())]);
        setSettlement(null);
        setForm(null);
        return;
      }

      const [detail, monthHistory, previousDetail] = await Promise.all([
        getMonthlySettlement(selectedMonth, driverId),
        getMonthlySettlementHistory(driverId),
        getMonthlySettlement(getPreviousCalendarMonth(selectedMonth), driverId),
      ]);
      setSettlement(detail);
      setOwnerOverview(null);
      setHistory(monthHistory);
      setPreviousSettlement(previousDetail);
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
  }, [driverId, drivers, owner, selectedMonth]);

  useEffect(() => {
    load();
  }, [load]);

  const availableMonths = useMemo(() => {
    const months = new Set([currentMonth(), selectedMonth]);
    history.forEach((month) => months.add(month));
    return [...months].sort().reverse();
  }, [history, selectedMonth]);

  const saveSettings = async (settingsConfirmed = false) => {
    try {
      setIsSaving(true);
      setError("");
      const updated = await updateMonthlySettings(selectedMonth, { ...form, settingsConfirmed }, driverId);
      setSettlement(updated);
      setNotice(settingsConfirmed ? "Datos mensuales confirmados" : "Cambios del mes guardados");
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

  if (isLoading) {
    return <Card><p className="text-center text-slate-300">Preparando la liquidación mensual...</p>{error && <p className="mt-3 text-center text-red-300">{error}</p>}</Card>;
  }

  if (owner && driverId === "all" && ownerOverview) {
    return (
      <OwnerMonthlyOverview
        currentUser={currentUser}
        drivers={drivers}
        overview={ownerOverview}
        selectedMonth={selectedMonth}
        availableMonths={availableMonths}
        onMonthChange={setSelectedMonth}
        onDriverChange={(nextDriverId) => {
          selectDriver(nextDriverId);
          setShowMonthSettings(false);
        }}
      />
    );
  }

  if (!settlement || !form) {
    return <Card><p className="text-center text-red-300">{error || "No se pudo preparar este resumen."}</p></Card>;
  }

  const calculation = settlement.calculation;
  const averageDailyDriverEarning = calculation.averageDailyDriverEarning ?? (
    calculation.workedDays ? Number(calculation.driverHalf || 0) / calculation.workedDays : 0
  );
  const previewExpectedDays = Math.max(1, Number(form.expectedWorkDays || 1));
  const previewMonthlySocialSecurity = Math.max(0, Number(form.socialSecurity || 0));
  const previewDailySocialSecurity = previewMonthlySocialSecurity / previewExpectedDays;
  const previewAppliedSocialSecurity = settlement.status === "IN_PROGRESS"
    ? previewDailySocialSecurity * Math.min(calculation.workedDays, previewExpectedDays)
    : previewMonthlySocialSecurity;
  const [statusText, statusClass] = statusInfo[settlement.status] || statusInfo.EMPTY;
  const dailyMonth = settlement.dailySettlementMonth;
  const dailyDriverEarningAverage = dailyMonth?.workedDays
    ? Number(dailyMonth.driverShare || 0) / Number(dailyMonth.workedDays)
    : 0;
  const monthlyComparison = buildDailyMonthlyComparison(
    settlement,
    previousSettlement
  );

  if (owner) {
    return (
      <OwnerDriverMonthlyDetail
        currentUser={currentUser}
        drivers={drivers}
        settlement={settlement}
        selectedMonth={selectedMonth}
        availableMonths={availableMonths}
        selectedDriverId={driverId}
        onDriverChange={(nextDriverId) => {
          selectDriver(nextDriverId);
          setShowMonthSettings(false);
        }}
        onMonthChange={setSelectedMonth}
      />
    );
  }

  if (salariedDriver) {
    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle
            title="Resumen mensual"
            subtitle="Tus jornadas y tu facturación del mes"
          />
          <select
            aria-label="Mes del resumen"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-bold capitalize text-white"
          >
            {availableMonths.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
          </select>
        </div>

        {error && <Card className="border-red-500/30"><p className="text-sm text-red-300">{error}</p></Card>}

        <Card className="border-emerald-500/25">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">{monthLabel(selectedMonth)}</p>
          <h2 className="mt-2 text-2xl font-black">{calculation.workedDays} jornadas cerradas</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Facturación</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.rawRevenue)}</p></div>
            <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Efectivo</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.cashGenerated)}</p></div>
            <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Datáfono</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.cardGenerated)}</p></div>
            <div className="rounded-2xl bg-emerald-500/10 p-4"><p className="text-xs text-emerald-300">Ganancia promedio diaria</p><p className="mt-1 text-lg font-black">{formatCurrency(dailyDriverEarningAverage)}</p></div>
          </div>
          <div className="mt-4 rounded-2xl bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between gap-4"><p className="text-sm text-emerald-200">Combustible registrado</p><p className="font-black">{formatCurrency(calculation.fuelOwn)}</p></div>
            <div className="mt-3 flex items-center justify-between gap-4 border-t border-emerald-500/20 pt-3"><p className="font-bold text-white">Facturación menos combustible</p><p className="text-xl font-black">{formatCurrency(calculation.netRevenueForSplit)}</p></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-sky-500/10 p-4"><p className="text-xs text-sky-300">Comisiones</p><p className="mt-1 text-xl font-black">{formatCurrency(settlement.salariedMetrics?.commission)}</p></div>
            <div className="rounded-2xl bg-amber-500/10 p-4"><p className="text-xs text-amber-300">Propinas</p><p className="mt-1 text-xl font-black">{formatCurrency(settlement.salariedMetrics?.tip)}</p></div>
          </div>
          {settlement.salariedMetrics?.commissionByCompany?.length > 0 && <div className="mt-4 rounded-2xl border border-sky-500/20 p-4"><p className="text-sm font-bold text-sky-300">Comisiones por empresa</p><div className="mt-3 space-y-2">{settlement.salariedMetrics.commissionByCompany.map((item) => <div key={item.name} className="flex justify-between gap-4 text-sm"><span>{item.name} · {item.tripCount} viajes</span><strong>{formatCurrency(item.amount)}</strong></div>)}</div></div>}
        </Card>

        {dailyMonth && (
          <Card className="border-sky-500/25">
            <p className="text-xs font-bold tracking-[0.16em] text-sky-300">
              LIQUIDACIÓN DIARIA DEL MES
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Suma exacta de {dailyMonth.workedDays} cierres diarios. No se recalculan importes.
            </p>

            <div className="mt-4 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-950/60 px-4">
              <MoneyRow label="Facturación neta" value={dailyMonth.netRevenue} />
              <MoneyRow label="Seguridad Social" value={-dailyMonth.socialSecurity} />
              <MoneyRow label="Gasolina" value={-dailyMonth.fuelCost} />
              <MoneyRow label="Base repartida" value={dailyMonth.distributableBase} emphasis />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-4">
                <p className="text-xs text-emerald-300">Ganancia de Alberto</p>
                <p className="mt-1 text-xl font-black">{formatCurrency(dailyMonth.driverShare)}</p>
              </div>
              <div className="rounded-2xl bg-sky-500/10 p-4">
                <p className="text-xs text-sky-300">Ganancia del jefe</p>
                <p className="mt-1 text-xl font-black">{formatCurrency(dailyMonth.ownerShare)}</p>
              </div>
            </div>

            <div className="mt-3 divide-y divide-slate-800 rounded-2xl border border-slate-800 px-4">
              <MoneyRow label="Reintegro de gasolina" value={dailyMonth.reimbursableFuel} />
              <MoneyRow label="Total correspondiente a Alberto" value={dailyMonth.driverEntitlement} emphasis />
              {Number(dailyMonth.ownerAdjustment || 0) > 0 && <MoneyRow label="Cuentas externas a favor del jefe" value={-dailyMonth.ownerAdjustment} />}
              <MoneyRow label="Saldos generados este mes" value={dailyMonth.dailyBalance} />
              <MoneyRow label="Recibido del jefe este mes" value={-dailyMonth.paymentsReceived} />
              <MoneyRow label="Entregado al jefe este mes" value={dailyMonth.paymentsDelivered} />
            </div>

            <div className={`mt-3 rounded-2xl border p-5 ${
              dailyMonth.pendingBalance > 0
                ? "border-sky-400/30 bg-sky-400/10"
                : dailyMonth.pendingBalance < 0
                  ? "border-amber-400/30 bg-amber-400/10"
                  : "border-slate-700 bg-slate-900"
            }`}>
              <p className="text-xs font-black tracking-[0.14em] text-slate-300">
                SALDO PENDIENTE ACTUAL
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="font-bold text-white">
                  {dailyMonth.pendingBalance > 0
                    ? "El jefe te debe"
                    : dailyMonth.pendingBalance < 0
                      ? "Debes entregar al jefe"
                      : "Todo saldado"}
                </p>
                <p className="text-2xl font-black text-white">
                  {formatCurrency(Math.abs(dailyMonth.pendingBalance))}
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Puede incluir pendientes de meses anteriores.
              </p>
            </div>
          </Card>
        )}

        {monthlyComparison && (
          <Card>
            <p className="text-xs font-bold tracking-[0.16em] text-violet-300">
              COMPARACIÓN CON {monthLabel(monthlyComparison.previousMonth).toUpperCase()}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Diferencia respecto del mes calendario anterior.
            </p>
            <div className="mt-4 divide-y divide-slate-800">
              {monthlyComparison.rows.map((row) => {
                const positive = row.difference > 0;
                const neutral = row.difference === 0;
                const formatValue = (value) => row.format === "currency"
                  ? formatCurrency(value)
                  : String(value);
                return (
                  <div key={row.label} className="grid grid-cols-[1fr_auto] gap-4 py-3">
                    <div>
                      <p className="font-bold text-white">{row.label}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Antes: {formatValue(row.previous)} · Ahora: {formatValue(row.current)}
                      </p>
                    </div>
                    <p className={`self-center font-black ${
                      neutral ? "text-slate-400" : positive ? "text-emerald-300" : "text-amber-300"
                    }`}>
                      {positive ? "+" : ""}{formatValue(row.difference)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {dailyMonth && calculation.workedDays > 0 && (
          <MonthlySettlementShareButton settlement={settlement} />
        )}

        <Card>
          <h3 className="text-lg font-bold">Mis jornadas del mes</h3>
          {settlement.days.length === 0 ? <p className="mt-3 text-sm text-slate-400">Todavía no hay jornadas cerradas en este mes.</p> : (
            <div className="mt-4 divide-y divide-slate-800">
              {settlement.days.map((day) => {
                const normalizedDate = normalizeWorkDayDate(day.date);
                return <div key={day.workDayId} className="flex items-center justify-between gap-4 py-3"><div><p className="font-bold">{new Date(`${normalizedDate}T12:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</p><p className="text-xs text-slate-500">{day.tripCount} viajes · combustible {formatCurrency(day.fuelOwn)}</p><p className="mt-1 text-xs font-bold text-amber-300">Propina personal: {formatCurrency(day.tip)}</p>{day.dailySettlement && <p className="mt-1 text-xs text-sky-300">Saldo del día: {formatCurrency(day.dailySettlement.balance)}</p>}</div><div className="text-right"><p className="text-xs text-slate-500">{day.dailySettlement ? "Tu ganancia" : "Neto"}</p><p className="font-black">{formatCurrency(day.dailySettlement?.driverShare ?? day.netRevenue)}</p></div></div>;
              })}
            </div>
          )}
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          title="Liquidación mensual"
          subtitle={owner ? `Seguimiento de ${settlement.driver.displayName}` : "Tus cuentas con José, sin cálculos manuales"}
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowMonthSettings((visible) => !visible)} className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-200">{showMonthSettings ? "Volver al resumen" : "Datos del mes"}</button>
          <select
            aria-label="Mes de la liquidación"
            value={selectedMonth}
            onChange={(event) => { setSelectedMonth(event.target.value); setShowMonthSettings(false); }}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-bold capitalize text-white"
          >
            {availableMonths.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
          </select>
        </div>
      </div>

      {notice && <Card className="border-emerald-500/30 bg-emerald-500/10"><p className="text-sm font-bold text-emerald-300">{notice}</p></Card>}
      {error && <Card className="border-red-500/30"><p className="text-sm text-red-300">{error}</p></Card>}

      {!showMonthSettings && <Card className="overflow-hidden border-emerald-500/25">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">{monthLabel(selectedMonth)}</p>
            <h2 className="mt-2 text-2xl font-black">{calculation.workedDays} jornadas cerradas</h2>
            <p className="mt-1 text-sm text-slate-400">Solo se contabilizan jornadas finalizadas.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{statusText}</span>
        </div>
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-slate-950 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">Facturación total</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-white">{formatCurrency(calculation.rawRevenue)}</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Efectivo</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.cashGenerated)}</p></div>
          <div className="rounded-2xl bg-slate-950/70 p-4"><p className="text-xs text-slate-500">Datáfono</p><p className="mt-1 text-lg font-black">{formatCurrency(calculation.cardGenerated)}</p></div>
          <div className="rounded-2xl bg-emerald-500/10 p-4"><p className="text-xs text-emerald-300">Ganancia promedio neta diaria</p><p className="mt-1 text-lg font-black">{formatCurrency(averageDailyDriverEarning)}</p></div>
        </div>
      </Card>}

      {!showMonthSettings && <Card className="border-amber-500/25 bg-amber-500/5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Propina personal del mes</p>
        <p className="mt-2 text-3xl font-black text-white">{formatCurrency(settlement.salariedMetrics?.tip)}</p>
        <p className="mt-2 text-sm text-slate-400">Suma privada de todas las jornadas. No se incluye en los archivos compartidos.</p>
      </Card>}

      {!showMonthSettings && <div className="grid gap-6 lg:grid-cols-2">
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
      </div>}

      {showMonthSettings && <Card>
        <div className="flex items-start justify-between gap-4">
          <div><h3 className="text-lg font-bold">Datos del mes</h3><p className="mt-1 text-sm text-slate-400">Podés actualizarlos durante el mes. Confirmalos cuando recibas la nómina definitiva.</p></div>
          {settlement.status !== "IN_PROGRESS" && settlement.settings.settingsConfirmed && <span className="text-xs font-bold text-emerald-300">Revisados ✓</span>}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold">Seguridad Social mensual<input type="number" min="0" step="0.01" disabled={!settlement.canEditSettings} value={form.socialSecurity} onChange={(e) => setForm({ ...form, socialSecurity: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:opacity-60" /></label>
          <label className="text-sm font-semibold">Nómina transferida<input type="number" min="0" step="0.01" disabled={!settlement.canEditSettings} value={form.payrollTransfer} onChange={(e) => setForm({ ...form, payrollTransfer: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:opacity-60" /></label>
          <label className="text-sm font-semibold">Días previstos este mes<input type="number" min="1" max="31" step="1" disabled={!settlement.canEditSettings} value={form.expectedWorkDays} onChange={(e) => setForm({ ...form, expectedWorkDays: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 disabled:opacity-60" /></label>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:grid-cols-3">
          <div><p className="text-xs text-slate-500">Jornadas trabajadas hasta hoy</p><p className="mt-1 text-xl font-black">{calculation.workedDays}</p></div>
          <div><p className="text-xs text-slate-500">Seguridad Social por día</p><p className="mt-1 text-xl font-black">{formatCurrency(previewDailySocialSecurity)}</p></div>
          <div className="col-span-2 sm:col-span-1"><p className="text-xs text-sky-300">Seguridad Social aplicada hasta hoy</p><p className="mt-1 text-xl font-black text-white">{formatCurrency(previewAppliedSocialSecurity)}</p></div>
        </div>
        {settlement.canEditSettings && <div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" disabled={isSaving} onClick={() => saveSettings(false)} className="rounded-2xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 disabled:opacity-50">{isSaving ? "Guardando..." : "Guardar cambios"}</button>{settlement.status !== "IN_PROGRESS" && <button type="button" disabled={isSaving} onClick={() => saveSettings(true)} className="rounded-2xl border border-sky-500/50 bg-sky-500/10 px-5 py-4 font-bold text-sky-200 disabled:opacity-50">Confirmar datos definitivos</button>}</div>}
      </Card>}

      {!showMonthSettings && <Card>
        <h3 className="text-lg font-bold">Jornadas incluidas</h3>
        {settlement.days.length === 0 ? <p className="mt-3 text-sm text-slate-400">Todavía no hay jornadas cerradas en este mes.</p> : (
          <div className="mt-4 divide-y divide-slate-800">
            {settlement.days.map((day) => {
              const normalizedDate = normalizeWorkDayDate(day.date);
              const dailyNetTotal = Number(day.totalRevenue) - Number(day.fuelOwn) - Number(calculation.dailySocialSecurity);
              const estimatedDailyEarning = dailyNetTotal / 2;

              return <div key={day.workDayId} className="py-4"><div className="flex items-start justify-between gap-4"><div><p className="font-bold">{new Date(`${normalizedDate}T12:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</p><p className="text-xs text-slate-500">{day.tripCount} viajes · gasolina {formatCurrency(day.fuelOwn)}</p><p className="mt-1 text-xs font-bold text-amber-300">Propina personal: {formatCurrency(day.tip)}</p></div><div className="text-right"><p className="text-xs text-slate-500">Neto total del día</p><p className="font-black text-white">{formatCurrency(dailyNetTotal)}</p></div></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl bg-emerald-500/10 px-3 py-2"><p className="text-[11px] text-emerald-300">Ganancia neta Matías</p><p className="font-black">{formatCurrency(estimatedDailyEarning)}</p></div><div className="rounded-xl bg-sky-500/10 px-3 py-2"><p className="text-[11px] text-sky-300">Ganancia neta José</p><p className="font-black">{formatCurrency(estimatedDailyEarning)}</p></div></div></div>;
            })}
          </div>
        )}
      </Card>}

      {!showMonthSettings && !owner && settlement.canClose && <button type="button" onClick={() => setShowClose(true)} className="w-full rounded-2xl border border-sky-500/50 bg-sky-500/10 px-5 py-4 font-bold text-sky-200">Cerrar liquidación del mes</button>}
      {!showMonthSettings && settlement.status === "CLOSED" && <MonthlySettlementShareButton settlement={settlement} />}
      {showClose && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5"><div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6"><h3 className="text-xl font-black">Cerrar {monthLabel(selectedMonth)}</h3><p className="mt-3 text-sm text-slate-300">Los importes quedarán protegidos como una fotografía definitiva del mes.</p><label className="mt-5 block text-sm font-bold">Escribe CERRAR<input value={confirmation} onChange={(e) => setConfirmation(e.target.value.toUpperCase())} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" /></label><button type="button" disabled={isSaving} onClick={closeMonth} className="mt-5 w-full rounded-2xl bg-sky-400 px-5 py-4 font-black text-slate-950 disabled:opacity-50">Confirmar cierre</button><button type="button" onClick={() => setShowClose(false)} className="mt-3 w-full rounded-2xl border border-slate-700 px-5 py-4 font-bold">Volver</button></div></div>}
    </section>
  );
}

export default MonthlySettlementPage;
