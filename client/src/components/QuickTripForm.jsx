import { useState } from "react";

import Card from "./ui/Card";

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ",", "⌫"];

function QuickTripForm({ onSubmit }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleKeyPress = (key) => {
    setError("");
    setSuccessMessage("");

    if (key === "⌫") {
      setAmount((currentAmount) => currentAmount.slice(0, -1));
      return;
    }

    if (key === ",") {
      setAmount((currentAmount) => {
        if (currentAmount.includes(",")) {
          return currentAmount;
        }

        return currentAmount ? `${currentAmount},` : "0,";
      });

      return;
    }

    setAmount((currentAmount) => {
      const decimalPart = currentAmount.split(",")[1];

      if (decimalPart?.length >= 2) {
        return currentAmount;
      }

      if (currentAmount === "0") {
        return key;
      }

      return `${currentAmount}${key}`;
    });
  };

  const handleSave = async (paymentType) => {
    try {
      setError("");
      setSuccessMessage("");

      const numericAmount = Number(amount.replace(",", "."));

      if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Ingresá un importe mayor a 0.");
      }

      setIsSaving(true);

      await onSubmit({
        amount: numericAmount,
        paymentType,
        note: note.trim() || null,
      });

      const paymentLabel =
        paymentType === "cash" ? "efectivo" : "datáfono";

      setSuccessMessage(
        `Viaje de ${amount} € guardado en ${paymentLabel}.`
      );

      setAmount("");
      setNote("");
      setShowNote(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-right">
          <p className="text-sm text-slate-400">Importe del viaje</p>

          <p className="mt-2 min-h-14 text-5xl font-bold tracking-tight text-white">
            {amount || "0,00"}
            <span className="ml-2 text-2xl text-slate-400">€</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={isSaving}
              className="rounded-2xl border border-slate-700 bg-slate-800 py-5 text-2xl font-bold text-white transition hover:border-emerald-500/50 hover:bg-slate-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {key}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSave("cash")}
            disabled={isSaving}
            className="rounded-2xl bg-emerald-600 px-4 py-5 text-lg font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "💵 Guardar efectivo"}
          </button>

          <button
            type="button"
            onClick={() => handleSave("card")}
            disabled={isSaving}
            className="rounded-2xl bg-blue-600 px-4 py-5 text-lg font-bold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "💳 Guardar datáfono"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowNote((currentValue) => !currentValue)}
          className="w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
        >
          {showNote ? "Ocultar nota" : "+ Agregar nota opcional"}
        </button>

        {showNote && (
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej: comisión aeropuerto, propina..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
          />
        )}

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