import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";

import { createWorkDay } from "../services/workDayService";

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultWorkDayDate() {
  const now = new Date();
  const workDayDate = new Date(now);

  if (now.getHours() < 6) {
    workDayDate.setDate(workDayDate.getDate() - 1);
  }

  return formatDateForInput(workDayDate);
}

function NewWorkDayPage() {
  const [startKm, setStartKm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      await createWorkDay({
        date: getDefaultWorkDayDate(),
        startKm,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Nueva jornada"
        subtitle="Comienza tu turno registrando el kilometraje inicial."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Kilometraje inicial
            </label>

            <input
              id="startKm"
              name="startKm"
              type="number"
              value={startKm}
              onChange={(event) => setStartKm(event.target.value)}
              placeholder="Ej: 64220"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg outline-none focus:border-emerald-500"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit">Iniciar jornada</Button>
        </form>
      </Card>
    </section>
  );
}

export default NewWorkDayPage;