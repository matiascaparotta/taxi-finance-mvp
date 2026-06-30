import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function CloseWorkDayPage() {
  return (
    <section className="space-y-8">
      <SectionTitle
        title="Finalizar jornada"
        subtitle="Completa los últimos datos antes de cerrar el turno."
      />

      <Card>
        <p className="text-slate-300">
          Aquí mostraremos el resumen de la jornada y los datos finales.
        </p>

        <div className="mt-6">
          <Button>
            Confirmar cierre
          </Button>
        </div>
      </Card>
    </section>
  );
}

export default CloseWorkDayPage;