import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import WorkDayCard from "../components/WorkDayCard";
import { getOpenWorkDay, getWorkDays } from "../services/workDayService";

function HomePage() {
  const [workDays, setWorkDays] = useState([]);
  const [openWorkDay, setOpenWorkDay] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [workDaysData, openWorkDayData] = await Promise.all([
        getWorkDays(),
        getOpenWorkDay(),
      ]);

      setWorkDays(workDaysData);
      setOpenWorkDay(openWorkDayData);
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

      {openWorkDay ? (
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <p className="text-sm font-medium text-emerald-300">
            Jornada activa
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Turno iniciado
          </h2>

          <p className="mt-2 text-slate-300">
            Km inicial: <strong>{openWorkDay.startKm}</strong>
          </p>

          <div className="mt-6">
            <Button>Registrar viaje</Button>
          </div>
        </Card>
      ) : (
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
            <Button onClick={() => navigate("/new-work-day")}>
              Iniciar jornada
            </Button>
          </div>
        </Card>
      )}

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