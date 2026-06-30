import SectionTitle from "../components/ui/SectionTitle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function NewWorkDayPage() {
  return (
    <section className="space-y-8">
      <SectionTitle
        title="Nueva jornada"
        subtitle="Comienza tu turno registrando el kilometraje inicial."
      />

      <Card>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Kilometraje inicial
            </label>

            <input
              type="number"
              placeholder="Ej: 64220"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <Button className="w-full">
            Iniciar jornada
          </Button>
        </div>
      </Card>
    </section>
  );
}

export default NewWorkDayPage;