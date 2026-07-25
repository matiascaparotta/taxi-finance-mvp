import { useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { changePassword } from "../services/authService";
import { APP_NAME } from "../config/branding";

function ChangePasswordPage({
  currentUser,
  onPasswordChanged,
  onLogout,
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (newPassword !== confirmation) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      const session = await changePassword({
        currentPassword,
        newPassword,
      });
      onPasswordChanged(session);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md space-y-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-emerald-300">
            {APP_NAME}
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Crea tu contraseña
          </h1>
          <p className="mt-2 text-slate-400">
            Hola, {currentUser.displayName}. Cambia la contraseña
            temporal antes de continuar.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Contraseña temporal
              </label>
              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                required
                autoFocus
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Contraseña nueva
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                minLength={10}
                maxLength={128}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Mínimo 10 caracteres, con una letra y un número.
              </p>
            </div>

            <div>
              <label
                htmlFor="passwordConfirmation"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Repetir contraseña nueva
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) =>
                  setConfirmation(event.target.value)
                }
                minLength={10}
                maxLength={128}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : "Guardar contraseña"}
            </Button>
          </form>

          <button
            type="button"
            onClick={onLogout}
            className="mt-5 w-full text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            Cerrar sesión
          </button>
        </Card>
      </div>
    </main>
  );
}

export default ChangePasswordPage;
