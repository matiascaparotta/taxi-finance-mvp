import { useRef, useState } from "react";

import Card from "./ui/Card";
import {
  applyMoneyKey,
  parseMoneyInput,
} from "../utils/moneyKeypad";
import { calculateCompanyCommission, formatCompanyCommission } from "../utils/companyCommission";

const KEYS = [
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
  "0",
  ",",
  "⌫",
];

function QuickTripForm({ onSubmit, nextTripNumber = null, commissionCompanies = [] }) {
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState("");
  const [tip, setTip] = useState("");
  const [cashPaid, setCashPaid] = useState("");
  const [note, setNote] = useState("");
  const [commissionCompanyId, setCommissionCompanyId] = useState("");
  const [activeField, setActiveField] = useState("amount");
  const [showNote, setShowNote] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSaving, setIsSaving] = useState(false);
  const savingLockRef = useRef(false);
  const moneyFields = {
    amount: {
      label: "Importe",
      displayLabel: "Importe del viaje",
      value: amount,
      setValue: setAmount,
    },
    commission: {
      label: "Comisión",
      displayLabel: "Comisión del viaje",
      value: commission,
      setValue: setCommission,
    },
    tip: {
      label: "Propina",
      displayLabel: "Propina del viaje",
      value: tip,
      setValue: setTip,
    },
    cashPaid: {
      label: "Pagó",
      displayLabel: "Total pagado en efectivo",
      value: cashPaid,
      setValue: setCashPaid,
    },
  };
  const activeMoneyField = moneyFields[activeField];
  const selectedCommissionCompany = commissionCompanies.find(
    (item) => String(item.id) === String(commissionCompanyId)
  );
  const hasAutomaticCommission = selectedCommissionCompany?.commissionType === "PERCENTAGE";

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleKeyPress = (key) => {
    clearMessages();
    activeMoneyField.setValue((currentValue) => {
      const nextValue = applyMoneyKey(currentValue, key);
      if (activeField === "amount" && hasAutomaticCommission) {
        setCommission(calculateCompanyCommission(parseMoneyInput(nextValue), selectedCommissionCompany).toFixed(2));
      }
      if (activeField === "amount" && cashPaid) {
        const difference = parseMoneyInput(cashPaid) - parseMoneyInput(nextValue);
        setTip(difference > 0 ? difference.toFixed(2) : "");
      }
      if (activeField === "cashPaid") {
        const difference = parseMoneyInput(nextValue) - parseMoneyInput(amount);
        setTip(difference > 0 ? difference.toFixed(2) : "");
      }
      return nextValue;
    });
  };

  const resetForm = () => {
    setAmount("");
    setCommission("");
    setTip("");
    setCashPaid("");
    setNote("");
    setCommissionCompanyId("");
    setActiveField("amount");
    setShowNote(false);
  };

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    const selectedCompany = commissionCompanies.find(
      (item) => String(item.id) === String(companyId)
    );

    clearMessages();
    setCommissionCompanyId(companyId);
    setCommission(
      selectedCompany
        ? calculateCompanyCommission(parseMoneyInput(amount), selectedCompany).toFixed(2)
        : ""
    );
  };

  const vibrateOnSuccess = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(80);
    }
  };

  const handleSave = async (paymentType) => {
    if (savingLockRef.current) {
      return;
    }

    savingLockRef.current = true;
    setIsSaving(true);

    try {
      clearMessages();

      const numericAmount = parseMoneyInput(amount);
      const numericCommission = parseMoneyInput(commission);
      const numericCashPaid = parseMoneyInput(cashPaid);
      const hasCashPaymentTotal = paymentType === "cash" && Boolean(cashPaid);
      const numericTip = hasCashPaymentTotal
        ? Number((numericCashPaid - numericAmount).toFixed(2))
        : parseMoneyInput(tip);

      if (
        !amount ||
        Number.isNaN(numericAmount) ||
        numericAmount <= 0
      ) {
        throw new Error(
          "Ingresá un importe mayor a 0."
        );
      }

      if (
        Number.isNaN(numericCommission) ||
        numericCommission < 0
      ) {
        throw new Error(
          "La comisión no puede ser negativa."
        );
      }

      if (
        Number.isNaN(numericTip) ||
        numericTip < 0
      ) {
        throw new Error(
          "La propina no puede ser negativa."
        );
      }

      if (paymentType === "card" && cashPaid) {
        throw new Error("El campo Pagó se usa solo para viajes en efectivo. Para datáfono, cargá la propina directamente.");
      }

      if (hasCashPaymentTotal && numericCashPaid < numericAmount) {
        throw new Error("El total pagado no puede ser menor que el importe del viaje.");
      }

      await onSubmit({
        // El servidor guarda el total cobrado y descuenta la propina para
        // obtener la facturación real. Así, viaje 25 + pagó 27,50 conserva
        // 25 de facturación y registra 2,50 de propina.
        amount: hasCashPaymentTotal ? numericCashPaid : numericAmount,
        paymentType,
        commission: numericCommission,
        commissionCompanyId: commissionCompanyId || null,
        tip: numericTip,
        note: note.trim() || null,
      });

      const paymentLabel =
        paymentType === "cash"
          ? "efectivo"
          : "datáfono";

      vibrateOnSuccess();

      setSuccessMessage(
        hasCashPaymentTotal && numericTip > 0
          ? `✓ Viaje ${amount} € · propina ${numericTip.toFixed(2)} €`
          : `✓ ${amount} € guardado en ${paymentLabel}`
      );

      resetForm();

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      setError(
        error.message ||
          "No se pudo guardar el viaje."
      );
    } finally {
      savingLockRef.current = false;
      setIsSaving(false);
    }
  };
  return (
    <Card>
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-right">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {activeMoneyField.displayLabel}
            </p>

            {activeField !== "amount" ? (
              <button
                type="button"
                onClick={() => setActiveField("amount")}
                className="text-xs font-bold text-emerald-300"
              >
                ← Volver al importe
              </button>
            ) : nextTripNumber !== null ? (
              <p className="text-xs font-semibold text-slate-500">
                Viaje Nº {nextTripNumber}
              </p>
            ) : null}
          </div>

          <p className="mt-2 min-h-14 text-5xl font-bold tracking-tight text-white">
            {activeMoneyField.value || "0,00"}
            <span className="ml-2 text-2xl text-slate-400">
              €
            </span>
          </p>
        </div>

        {commissionCompanies.length > 0 && (
          <label className="block text-sm font-semibold text-slate-300">
            Empresa con comisión
            <select value={commissionCompanyId} onChange={handleCompanyChange} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
              <option value="">Sin comisión de empresa</option>
              {commissionCompanies.map((item) => <option key={item.id} value={item.id}>{item.name} · {formatCompanyCommission(item)}</option>)}
            </select>
            {commissionCompanyId && <span className="mt-2 block text-xs text-emerald-300">{hasAutomaticCommission ? `Se calcula automáticamente el ${formatCompanyCommission(selectedCommissionCompany)} sobre el importe.` : "Se completa con la comisión habitual, pero puedes cambiarla para este viaje."}</span>}
          </label>
        )}

        <div className="grid grid-cols-2 gap-2">
          {["commission", "tip"].map((field) => {
            const config = moneyFields[field];
            const isActive = activeField === field;

            return (
              <button
                key={field}
                type="button"
                onClick={() => {
                  if (field === "commission" && hasAutomaticCommission) return;
                  clearMessages();
                  setActiveField(field);
                }}
                disabled={field === "commission" && hasAutomaticCommission}
                aria-pressed={isActive}
                className={`rounded-xl border px-3 py-2 text-center text-sm transition active:scale-[0.98] ${
                  isActive
                    ? "border-emerald-400 bg-emerald-400/10 text-white"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                <span className="font-semibold">
                  {config.value
                    ? `${config.label}: ${config.value} €${field === "commission" && hasAutomaticCommission ? " · automática" : ""}`
                    : `+ ${config.label}`}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            clearMessages();
            setActiveField("cashPaid");
          }}
          aria-pressed={activeField === "cashPaid"}
          className={`w-full rounded-xl border px-4 py-3 text-sm transition active:scale-[0.98] ${
            activeField === "cashPaid"
              ? "border-emerald-400 bg-emerald-400/10 text-white"
              : "border-slate-700 text-slate-300"
          }`}
        >
          <span className="font-semibold">
            {cashPaid ? `Pagó en efectivo: ${cashPaid} €` : "+ Pagó más en efectivo"}
          </span>
          <span className="mt-1 block text-xs text-slate-400">
            Calcula la propina automáticamente
          </span>
        </button>

        {cashPaid && amount && parseMoneyInput(cashPaid) >= parseMoneyInput(amount) && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Viaje <strong>{Number(parseMoneyInput(amount)).toFixed(2)} €</strong>
            <span className="mx-2 text-amber-300">·</span>
            Propina <strong>{Number(Math.max(0, parseMoneyInput(cashPaid) - parseMoneyInput(amount))).toFixed(2)} €</strong>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={isSaving}
              className="rounded-2xl border border-slate-700 bg-slate-800 py-5 text-2xl font-bold text-white transition hover:border-emerald-500/50 hover:bg-slate-700 active:scale-[0.98] disabled:opacity-50"
            >
              {key}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowNote(!showNote)}
          className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
        >
          {showNote ? "Ocultar nota" : "+ Agregar nota"}
        </button>

        {showNote && (
          <textarea
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej: aeropuerto, cliente habitual..."
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSave("cash")}
            disabled={isSaving}
            className="rounded-2xl bg-emerald-600 px-4 py-5 text-lg font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
          >
            {isSaving
              ? "Guardando..."
              : "💵 Efectivo"}
          </button>

          <button
            type="button"
            onClick={() => handleSave("card")}
            disabled={isSaving}
            className="rounded-2xl bg-blue-600 px-4 py-5 text-lg font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
          >
            {isSaving
              ? "Guardando..."
              : "💳 Datáfono"}
          </button>
        </div>

        {successMessage && (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
            {successMessage}
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
}

export default QuickTripForm;
