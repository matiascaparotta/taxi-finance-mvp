import { useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { login } from "../services/authService";

function LoginPage({ onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      const session = await login({ username, password });
      setUsername("");
      setPassword("");
      onAuthenticated(session);
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
            Lic249
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-slate-400">
            Ingresa con tu usuario personal.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoFocus
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-lg text-white outline-none focus:border-emerald-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Durante la transición puedes dejarlo vacío y usar
                la contraseña actual.
              </p>
            </div>

            <div>
              <label
                htmlFor="accessPassword"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Contraseña
              </label>
              <input
                id="accessPassword"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
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
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;
