import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";

function TripForm({
  initialAmount = "",
  initialPaymentType = "cash",
  initialNote = "",
  submitLabel = "Guardar viaje",
  loadingLabel = "Guardando...",
  onSubmit,
}) {
  const [amount, setAmount] = useState(initialAmount);
  const [paymentType, setPaymentType] = useState(initialPaymentType);
  const [note, setNote] = useState(initialNote || "");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setIsSaving(true);

      if (!amount) {
        throw new Error("El importe del viaje es obligatorio");
      }

      if (Number(amount) <= 0) {
        throw new Error("El importe debe ser mayor a 0");
      }

      await onSubmit({
        amount: Number(amount),
        paymentType,
        note: note.trim() || null,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm text-slate-300"
          >
            Importe del viaje
          </label>

          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Ej: 18.40"
            autoFocus
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="paymentType"
            className="mb-2 block text-sm text-slate-300"
          >
            Método de pago
          </label>

          <select
            id="paymentType"
            name="paymentType"
            value={paymentType}
            onChange={(event) => setPaymentType(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
          >
            <option value="cash">Efectivo</option>
            <option value="card">Datáfono</option>
          </select>
        </div>

        <div>
          <label htmlFor="note" className="mb-2 block text-sm text-slate-300">
            Nota (opcional)
          </label>

          <textarea
            id="note"
            name="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej: cliente dejó propina, viaje corregido..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSaving}>
          {isSaving ? loadingLabel : submitLabel}
        </Button>
      </form>
    </Card>
  );
}

export default TripForm;