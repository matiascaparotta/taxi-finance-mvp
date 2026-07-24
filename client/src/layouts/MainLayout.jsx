import { Outlet } from "react-router-dom";

function MainLayout({ onLogout = null }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">🚖 Taxi Finance</h1>
            <p className="text-sm text-slate-400">
              Gestión financiera para conductores de taxi
            </p>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
