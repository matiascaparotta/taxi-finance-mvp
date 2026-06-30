function HomePage() {
    return (
      <section>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h2 className="text-xl font-semibold">Fase 2 iniciada</h2>
  
          <p className="mt-2 text-slate-300">
            El frontend de Taxi Finance ya está funcionando con React, Vite,
            Tailwind y React Router.
          </p>
  
          <button className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
            Nueva jornada
          </button>
        </div>
      </section>
    );
  }
  
  export default HomePage;