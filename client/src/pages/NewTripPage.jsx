import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { createTrip } from "../services/tripService";
import { getOpenWorkDay } from "../services/workDayService";

function NewTripPage() {
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const openWorkDay = await getOpenWorkDay();

      if (!openWorkDay) {
        throw new Error("No hay una jornada activa.");
      }

      await createTrip({
        workDayId: openWorkDay.id,
        amount: Number(amount),
        paymentType,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Nuevo viaje"
        subtitle="Registra el importe y el método de pago."
      />

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

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit">
            Guardar viaje
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default NewTripPage;