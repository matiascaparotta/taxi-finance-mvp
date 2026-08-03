import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { addCommissionCompany, getDriverSettings, saveCommissionCompany, saveDriverSettings } from "../services/driverSettingsService";

const emptyCompany = { name: "", commissionRate: "" };

function DriverSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [company, setCompany] = useState(emptyCompany);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    try { setSettings(await getDriverSettings()); setError(""); }
    catch (loadError) { setError(loadError.message); }
  };

  useEffect(() => { load(); }, []);

  const saveGeneral = async () => {
    try {
      await saveDriverSettings(settings);
      setNotice("Configuración guardada");
      await load();
    } catch (saveError) { setError(saveError.message); }
  };

  const addCompany = async (event) => {
    event.preventDefault();
    try {
      await addCommissionCompany(company);
      setCompany(emptyCompany);
      setNotice("Empresa agregada");
      await load();
    } catch (saveError) { setError(saveError.message); }
  };

  const toggleCompany = async (item) => {
    try {
      await saveCommissionCompany({ ...item, status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      setNotice(item.status === "ACTIVE" ? "Empresa retirada" : "Empresa reactivada");
      await load();
    } catch (saveError) { setError(saveError.message); }
  };

  const updateCompanyDraft = (id, field, value) => {
    setSettings({
      ...settings,
      companies: settings.companies.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const saveCompany = async (item) => {
    try {
      await saveCommissionCompany(item);
      setNotice("Empresa actualizada");
      await load();
    } catch (saveError) { setError(saveError.message); }
  };

  if (!settings) return <Card><p className="text-center text-slate-300">Preparando configuración...</p>{error && <p className="mt-3 text-red-300">{error}</p>}</Card>;

  return <section className="space-y-6">
    <SectionTitle title="Configuración" subtitle="Tus condiciones de trabajo y empresas con comisión" />
    {notice && <Card className="border-emerald-500/30 bg-emerald-500/10"><p className="text-emerald-300">{notice}</p></Card>}
    {error && <Card className="border-red-500/30"><p className="text-red-300">{error}</p></Card>}

    <Card>
      <h3 className="text-lg font-bold">Condiciones diarias</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Combustible por kilómetro<input aria-label="Tarifa por kilómetro" type="number" min="0.0001" step="0.01" value={settings.fuelRatePerKm} onChange={(e) => setSettings({ ...settings, fuelRatePerKm: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" /><span className="mt-1 block text-xs text-slate-500">€/km · se aplica a jornadas futuras</span></label>
        <label className="text-sm font-semibold">Seguridad Social diaria<input aria-label="Seguridad Social diaria" type="number" min="0" step="0.01" value={settings.dailySocialSecurity} onChange={(e) => setSettings({ ...settings, dailySocialSecurity: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" /><span className="mt-1 block text-xs text-slate-500">Se descuenta antes del reparto diario</span></label>
      </div>
      <button type="button" onClick={saveGeneral} className="mt-5 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-bold text-slate-950">Guardar condiciones</button>
    </Card>

    <Card>
      <h3 className="text-lg font-bold">Empresas y hoteles</h3>
      <p className="mt-1 text-sm text-slate-400">La comisión queda identificada por empresa en cada viaje.</p>
      <form onSubmit={addCompany} className="mt-5 grid gap-3 sm:grid-cols-[1fr_10rem_auto]">
        <input aria-label="Nombre de empresa" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} placeholder="Nombre de empresa" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" />
        <input aria-label="Porcentaje de comisión" type="number" min="0" max="100" step="0.01" value={company.commissionRate} onChange={(e) => setCompany({ ...company, commissionRate: e.target.value })} placeholder="Comisión %" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" />
        <button className="rounded-xl bg-sky-400 px-5 py-3 font-bold text-slate-950">Agregar</button>
      </form>
      <div className="mt-5 space-y-3">
        {settings.companies.length === 0 && <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">Todavía no agregaste empresas.</p>}
        {settings.companies.map((item) => <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><div className="grid gap-3 sm:grid-cols-[1fr_9rem_auto_auto]"><input aria-label={`Nombre de ${item.name}`} value={item.name} onChange={(e) => updateCompanyDraft(item.id, "name", e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-bold" /><label className="relative"><input aria-label={`Comisión de ${item.name}`} type="number" min="0" max="100" step="0.01" value={item.commissionRate} onChange={(e) => updateCompanyDraft(item.id, "commissionRate", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 pr-7 text-emerald-300" /><span className="absolute right-3 top-2 text-slate-500">%</span></label><button type="button" onClick={() => saveCompany(item)} className="rounded-xl bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-950">Guardar</button><button type="button" onClick={() => toggleCompany(item)} className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold">{item.status === "ACTIVE" ? "Retirar" : "Reactivar"}</button></div></div>)}
      </div>
    </Card>
  </section>;
}

export default DriverSettingsPage;
