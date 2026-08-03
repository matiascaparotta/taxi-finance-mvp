import { Link, Outlet, useLocation } from "react-router-dom";
import { APP_NAME } from "../config/branding";
import {
  getUserInitials,
  getUserNavigation,
  getUserRoleLabel,
} from "../utils/userNavigation";

const icons = {
  home: (
    <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5h-5.2v-6.8H8.7V21H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
  ),
  "work-day": (
    <>
      <path d="M6 3v3M18 3v3M4 9h16" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 13h3M13 13h3M8 17h3" />
    </>
  ),
  drivers: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20v-2.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V20M16 5.5a3 3 0 0 1 0 5.8M16.5 14a4.8 4.8 0 0 1 4 4.7V20" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </>
  ),
  monthly: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M7 2v4M17 2v4M3 9h18M8 14h2M14 14h2M8 18h2" />
    </>
  ),
};

function NavigationIcon({ id }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={id === "home" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[id]}
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M14 8l4 4-4 4M18 12H9" />
    </svg>
  );
}

function MainLayout({ onLogout = null, currentUser = null }) {
  const location = useLocation();
  const navigation = getUserNavigation(currentUser);
  const userName = currentUser?.displayName || "Usuario TaxFin";

  const isNavigationActive = (item) => {
    if (item.id === "home") {
      return location.pathname === "/";
    }

    if (item.id === "work-day") {
      return [
        "/my-work-day",
        "/new-work-day",
        "/new-trip",
        "/close-work-day",
      ].some((path) => location.pathname.startsWith(path));
    }

    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 shadow-lg shadow-black/10 sm:static">
        <div className="taxfin-safe-header mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/"
              aria-label="Ir al inicio de TaxFin"
              className="flex min-w-0 items-center gap-3 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
            >
              <img
                src="/icon-192.png"
                alt=""
                className="h-11 w-11 shrink-0 rounded-xl border border-emerald-400/40 shadow-md shadow-emerald-950 sm:h-13 sm:w-13"
              />
              <div className="min-w-0">
                <p className="truncate text-xl font-black tracking-tight sm:text-2xl">
                  {APP_NAME}
                </p>
                <p className="hidden text-xs text-slate-400 sm:block">
                  Gestión financiera para taxis
                </p>
              </div>
            </Link>

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              {currentUser && (
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div className="min-w-0 text-right">
                    <p className="max-w-30 truncate text-xs font-bold text-white sm:max-w-56 sm:text-sm">
                      {userName}
                    </p>
                    <p className="truncate text-[11px] font-medium text-emerald-300 sm:text-xs">
                      {getUserRoleLabel(currentUser)}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400 bg-emerald-500/10 text-sm font-black text-emerald-100 sm:h-11 sm:w-11"
                  >
                    {getUserInitials(userName)}
                  </div>
                </div>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label={`Cerrar sesión de ${userName}`}
                  title="Cerrar sesión"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-emerald-500/50 hover:bg-slate-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:h-11 sm:w-11"
                >
                  <LogoutIcon />
                </button>
              )}
            </div>
          </div>

          <nav
            aria-label="Navegación principal"
            className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-800 bg-slate-950/98 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black sm:static sm:mt-3 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:shadow-none"
          >
            {navigation.map((item) => {
              const active = isNavigationActive(item);

              return (
                <Link
                  key={item.id}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2.5 text-center text-[10px] font-bold leading-tight transition min-[420px]:text-xs sm:min-w-32 sm:flex-row sm:gap-2 sm:whitespace-nowrap sm:px-3 sm:py-3 sm:text-sm ${
                    active
                      ? "text-emerald-300"
                      : "text-slate-400 hover:bg-slate-900/70 hover:text-white"
                  }`}
                >
                  <NavigationIcon id={item.id} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
