import { useEffect, useState } from "react";
import {
  activateTaxFinUpdate,
  hasTaxFinUpdate,
} from "../services/pwaService";

function PwaStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(hasTaxFinUpdate);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleUpdate = () => setUpdateAvailable(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("taxfin:update-available", handleUpdate);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("taxfin:update-available", handleUpdate);
    };
  }, []);

  if (!isOnline) {
    return (
      <aside className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-md rounded-2xl border border-amber-400/40 bg-slate-950 p-4 text-sm shadow-2xl">
        <p className="font-bold text-amber-200">TaxFin está sin conexión</p>
        <p className="mt-1 text-slate-300">
          Podés abrir la aplicación, pero no se guardarán jornadas, viajes ni correcciones hasta recuperar internet.
        </p>
      </aside>
    );
  }

  if (!updateAvailable) {
    return null;
  }

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-md rounded-2xl border border-emerald-400/40 bg-slate-950 p-4 text-sm shadow-2xl">
      <p className="font-bold text-white">Hay una nueva versión de TaxFin</p>
      <p className="mt-1 text-slate-300">
        Actualizá cuando no estés cargando un viaje.
      </p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={activateTaxFinUpdate}
          className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950"
        >
          Actualizar TaxFin
        </button>
        <button
          type="button"
          onClick={() => setUpdateAvailable(false)}
          className="rounded-xl border border-slate-700 px-4 py-3 font-bold text-slate-300"
        >
          Después
        </button>
      </div>
    </aside>
  );
}

export default PwaStatus;
