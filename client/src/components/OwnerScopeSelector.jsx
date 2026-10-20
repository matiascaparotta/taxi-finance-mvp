function OwnerScopeSelector({
  currentUser,
  drivers,
  value,
  onChange,
  allLabel = "Toda la empresa",
}) {
  const options = [
    {
      id: "all",
      label: allLabel,
      detail: "Resumen conjunto",
      icon: "▦",
    },
    ...drivers.map((driver) => ({
      id: String(driver.id),
      label:
        String(driver.id) === String(currentUser?.id)
          ? "Mis datos"
          : driver.displayName,
      detail:
        String(driver.id) === String(currentUser?.id)
          ? currentUser?.displayName
          : "Ver solo este conductor",
      icon:
        String(driver.id) === String(currentUser?.id) ? "Yo" :
          driver.displayName?.trim().charAt(0).toLocaleUpperCase("es-ES") || "C",
    })),
  ];

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-white">
        ¿Qué querés consultar?
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const selected = String(value) === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
              className={`flex min-h-20 items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                selected
                  ? "border-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-400/30"
                  : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
              }`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                selected
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-800 text-slate-200"
              }`}>
                {option.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-black text-white">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {option.detail}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OwnerScopeSelector;

