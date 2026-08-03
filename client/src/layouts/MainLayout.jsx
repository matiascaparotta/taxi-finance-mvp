import { Link, Outlet } from "react-router-dom";
import { APP_NAME } from "../config/branding";

function MainLayout({ onLogout = null, currentUser = null }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="Ir al inicio de TaxFin">
            <h1 className="text-2xl font-bold">🚖 {APP_NAME}</h1>
            <p className="text-sm text-slate-400">
              Gestión financiera para conductores de taxi
            </p>
          </Link>

          <div className="flex items-center gap-3">
            {currentUser && (
              <p className="hidden text-right text-sm text-slate-300 sm:block">
                <span className="block font-semibold text-white">
                  {currentUser.displayName}
                </span>
                <span>{currentUser.organizationName}</span>
              </p>
            )}

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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
