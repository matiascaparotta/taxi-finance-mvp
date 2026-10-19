import { useRef, useState } from "react";

import { formatCurrency } from "../utils/formatCurrency";
import { getDailySettlementPresentation } from "../utils/getDailySettlementPresentation";
import { getPendingBalancePresentation } from "../utils/getPendingBalancePresentation";
import { applyMoneyKey, parseMoneyInput } from "../utils/moneyKeypad";

const RESULT_STYLES = {
  sky: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  slate: "border-slate-600 bg-slate-800/70 text-slate-200",
};

const PAYMENT_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ",", "⌫"];

function SettlementRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <p className={strong ? "font-bold text-white" : "text-sm text-slate-400"}>
        {label}
      </p>
      <p className={strong ? "text-lg font-black text-white" : "font-semibold text-white"}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function DailySettlementCard({ settlement, onRegisterPayment = null }) {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const paymentLockRef = useRef(false);
  const idempotencyKeyRef = useRef("");

  if (!settlement) {
    return null;
  }

  const result = getDailySettlementPresentation(settlement);
  const percentage = Number(settlement.driverSharePercentage || 0);
  const pendingBalance = Number(settlement.pendingBalance || 0);
  const pending = getPendingBalancePresentation(pendingBalance);
  const payments = Array.isArray(settlement.payments)
    ? settlement.payments
    : [];
  const visiblePayments = showAllPayments ? payments : payments.slice(0, 3);
  const paymentAction = pendingBalance > 0
    ? "Recibido del jefe"
    : "Entregado al jefe";

  const openPayment = () => {
    setPaymentAmount(Math.abs(pendingBalance).toFixed(2).replace(".", ","));
    setPaymentError("");
    idempotencyKeyRef.current = crypto.randomUUID();
    setShowPayment(true);
  };

  const closePayment = () => {
    setShowPayment(false);
    setPaymentAmount("");
    setPaymentError("");
    idempotencyKeyRef.current = "";
  };

  const confirmPayment = async () => {
    if (paymentLockRef.current) return;

    const amount = parseMoneyInput(paymentAmount);
    if (!(amount > 0)) {
      setPaymentError("Ingresá un importe mayor que cero.");
      return;
    }
    if (amount > Math.abs(pendingBalance)) {
      setPaymentError("El importe no puede superar el saldo pendiente.");
      return;
    }

    paymentLockRef.current = true;
    setIsSavingPayment(true);
    setPaymentError("");

    try {
      await onRegisterPayment({
        amount,
        idempotencyKey: idempotencyKeyRef.current,
      });
      closePayment();
    } catch (error) {
      setPaymentError(error.message || "No se pudo registrar el pago.");
    } finally {
      paymentLockRef.current = false;
      setIsSavingPayment(false);
    }
  };

  return (
    <section className="mt-7" aria-labelledby="daily-settlement-title">
      <h3
        id="daily-settlement-title"
        className="text-xs font-bold tracking-[0.18em] text-sky-300"
      >
        LIQUIDACIÓN DEL DÍA
      </h3>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 px-4">
        <div className="divide-y divide-slate-800">
          <SettlementRow label="Facturación neta" value={settlement.netRevenue} />
          <SettlementRow label="Seguridad Social" value={-settlement.socialSecurity} />
          <SettlementRow label="Gasolina" value={-settlement.fuelCost} />
          <SettlementRow label="Base para repartir" value={settlement.distributableBase} strong />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-700 py-4">
          <div className="rounded-xl bg-slate-950/70 p-3">
            <p className="text-xs text-slate-400">Tu parte · {percentage} %</p>
            <p className="mt-1 text-lg font-black text-white">
              {formatCurrency(settlement.driverShare)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-950/70 p-3">
            <p className="text-xs text-slate-400">Parte del jefe</p>
            <p className="mt-1 text-lg font-black text-white">
              {formatCurrency(settlement.ownerShare)}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800 border-t border-slate-700">
          <SettlementRow label="Reintegro de gasolina" value={settlement.reimbursableFuel} />
          <SettlementRow label="Total que te corresponde" value={settlement.driverEntitlement} strong />
          <SettlementRow label="Efectivo que conservaste" value={settlement.cashRetained} />
          {Number(settlement.ownerAdjustment || 0) > 0 && (
            <SettlementRow label="Cuenta externa a favor del jefe" value={-settlement.ownerAdjustment} />
          )}
        </div>
      </div>

      <div className={`mt-3 rounded-2xl border p-5 ${RESULT_STYLES[result.tone]}`}>
        <p className="text-xs font-black tracking-[0.16em]">{result.eyebrow}</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="text-lg font-black text-white">{result.title}</p>
          <p className="text-3xl font-black text-white">
            {formatCurrency(result.amount)}
          </p>
        </div>
        <p className="mt-2 text-sm opacity-80">{result.description}</p>
      </div>

      <div className={`mt-3 rounded-2xl border p-5 ${pending.tone}`}>
        <p className="text-xs font-black tracking-[0.16em]">
          SALDO AL FINALIZAR ESTA JORNADA
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="text-base font-black text-white">{pending.label}</p>
          <p className="text-2xl font-black text-white">
            {formatCurrency(Math.abs(pendingBalance))}
          </p>
        </div>
        <p className="mt-2 text-sm opacity-80">
          Incluye únicamente jornadas y pagos registrados hasta esta fecha.
        </p>

        {onRegisterPayment && pendingBalance !== 0 && !showPayment && (
          <button
            type="button"
            onClick={openPayment}
            className="mt-4 w-full rounded-xl border border-current/30 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/5 active:scale-[0.99]"
          >
            Registrar pago
          </button>
        )}
      </div>

      {payments.length > 0 && (
        <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-slate-400">
                HISTORIAL DE PAGOS
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {payments.length} {payments.length === 1 ? "movimiento" : "movimientos"}
              </p>
            </div>
          </div>

          <div className="mt-3 divide-y divide-slate-800">
            {visiblePayments.map((payment) => {
              const received = payment.direction === "OWNER_TO_DRIVER";
              const createdAt = new Date(payment.createdAt);
              const formattedDate = Number.isNaN(createdAt.getTime())
                ? "Fecha no disponible"
                : createdAt.toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

              return (
                <div key={payment.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-bold text-white">
                      {received ? "Recibido del jefe" : "Entregado al jefe"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{formattedDate}</p>
                  </div>
                  <p className="font-black text-white">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              );
            })}
          </div>

          {payments.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllPayments((current) => !current)}
              className="mt-2 w-full rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-300"
            >
              {showAllPayments ? "Mostrar menos" : `Ver los ${payments.length} pagos`}
            </button>
          )}
        </div>
      )}

      {showPayment && (
        <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900/90 p-4">
          <p className="text-xs font-black tracking-[0.14em] text-slate-400">
            {paymentAction.toUpperCase()}
          </p>
          <p className="mt-2 text-right text-4xl font-black text-white">
            {paymentAmount || "0,00"} <span className="text-xl text-slate-400">€</span>
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {PAYMENT_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                disabled={isSavingPayment}
                onClick={() => {
                  setPaymentError("");
                  setPaymentAmount((current) => applyMoneyKey(current, key));
                }}
                className="rounded-xl border border-slate-700 bg-slate-950 py-3 text-lg font-bold text-white active:scale-[0.98] disabled:opacity-50"
              >
                {key}
              </button>
            ))}
          </div>

          {paymentError && (
            <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {paymentError}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isSavingPayment}
              onClick={closePayment}
              className="rounded-xl border border-slate-700 px-3 py-3 text-sm font-bold text-slate-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSavingPayment}
              onClick={confirmPayment}
              className="rounded-xl bg-emerald-400 px-3 py-3 text-sm font-black text-slate-950 disabled:cursor-wait disabled:opacity-60"
            >
              {isSavingPayment ? "Guardando..." : `Confirmar · ${paymentAction}`}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DailySettlementCard;
