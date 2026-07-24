import { useRef, useState } from "react";

import Card from "./ui/Card";
import {
  applyMoneyKey,
  parseMoneyInput,
} from "../utils/moneyKeypad";

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

function QuickTripForm({ onSubmit, nextTripNumber = null }) {
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState("");
  const [tip, setTip] = useState("");
  const [note, setNote] = useState("");
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
  };
  const activeMoneyField = moneyFields[activeField];

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleKeyPress = (key) => {
    clearMessages();
    activeMoneyField.setValue((currentValue) =>
      applyMoneyKey(currentValue, key)
    );
  };

  const resetForm = () => {
    setAmount("");
    setCommission("");
    setTip("");
    setNote("");
    setActiveField("amount");
    setShowNote(false);
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
      const numericTip = parseMoneyInput(tip);

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

      await onSubmit({
        amount: numericAmount,
        paymentType,
        commission: numericCommission,
        tip: numericTip,
        note: note.trim() || null,
      });

      const paymentLabel =
        paymentType === "cash"
          ? "efectivo"
          : "datáfono";

      vibrateOnSuccess();

      setSuccessMessage(
        `✓ ${amount} € guardado en ${paymentLabel}`
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

        <div className="grid grid-cols-2 gap-2">
          {["commission", "tip"].map((field) => {
            const config = moneyFields[field];
            const isActive = activeField === field;

            return (
              <button
                key={field}
                type="button"
                onClick={() => {
                  clearMessages();
                  setActiveField(field);
                }}
                aria-pressed={isActive}
                className={`rounded-xl border px-3 py-2 text-center text-sm transition active:scale-[0.98] ${
                  isActive
                    ? "border-emerald-400 bg-emerald-400/10 text-white"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                <span className="font-semibold">
                  {config.value
                    ? `${config.label}: ${config.value} €`
                    : `+ ${config.label}`}
                </span>
              </button>
            );
          })}
        </div>

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
