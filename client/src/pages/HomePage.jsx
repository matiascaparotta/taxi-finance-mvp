import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import WorkDayCard from "../components/WorkDayCard";
import { getWorkDays } from "../services/workDayService";

function HomePage() {
  const [workDays, setWorkDays] = useState([]);

  useEffect(() => {
    loadWorkDays();
  }, []);

  const loadWorkDays = async () => {
    try {
      const data = await getWorkDays();
      setWorkDays(data);
    } catch (error) {
      console.error(error);
    }
  };

  const lastWorkDay = workDays[0];

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Hola, Mati 👋"
        subtitle="Bienvenido a Taxi Finance"
      />

      <Card className="border-emerald-500/30 bg-emerald-500/10">
        <p className="text-sm font-medium text-emerald-300">
          Acción principal
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Iniciar jornada
        </h2>

        <p className="mt-2 text-slate-300">
          Registra el kilometraje inicial y empieza tu turno.
        </p>

        <div className="mt-6">
          <Button>Iniciar jornada</Button>
        </div>
      </Card>

      {lastWorkDay && (
        <section className="space-y-3">
          <SectionTitle
            title="Última jornada"
            subtitle="Tu último turno registrado"
          />

          <WorkDayCard workDay={lastWorkDay} />
        </section>
      )}

      <section className="space-y-3">
        <SectionTitle
          title="Jornadas recientes"
          subtitle="Historial de tus últimos turnos"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {workDays.map((workDay) => (
            <WorkDayCard key={workDay.id} workDay={workDay} />
          ))}
        </div>
      </section>
    </section>
  );
}

export default HomePage;