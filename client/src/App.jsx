import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Card from "./components/ui/Card";
import Button from "./components/ui/Button";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import HomePage from "./pages/HomePage";
import NewWorkDayPage from "./pages/NewWorkDayPage";
import NewTripPage from "./pages/NewTripPage";
import CloseWorkDayPage from "./pages/CloseWorkDayPage";
import WorkDayClosedPage from "./pages/WorkDayClosedPage";
import EditTripPage from "./pages/EditTripPage";
import WorkDayHistoryPage from "./pages/WorkDayHistoryPage";
import WorkDayDetailPage from "./pages/WorkDayDetailPage";
import DriverManagementPage from "./pages/DriverManagementPage";
import {
  getSession,
  logout,
} from "./services/authService";

function PrivateApp() {
  const [authStatus, setAuthStatus] = useState("loading");
  const [authRequired, setAuthRequired] = useState(false);
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const checkSession = useCallback(async () => {
    try {
      setAuthError("");
      setAuthStatus("loading");
      const session = await getSession();
      setAuthRequired(session.authRequired);
      setCurrentUser(session.user || null);
      setAuthStatus(
        session.authenticated ? "authenticated" : "anonymous"
      );
    } catch (error) {
      setAuthError(error.message);
      setAuthStatus("error");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setCurrentUser(null);
      setAuthStatus("anonymous");
    }
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setAuthStatus("anonymous");
    };

    window.addEventListener(
      "taxfin:unauthorized",
      handleUnauthorized
    );

    return () =>
      window.removeEventListener(
        "taxfin:unauthorized",
        handleUnauthorized
      );
  }, []);

  useEffect(() => {
    const handlePasswordChangeRequired = () => {
      setCurrentUser((user) =>
        user ? { ...user, mustChangePassword: true } : user
      );
    };

    window.addEventListener(
      "taxfin:password-change-required",
      handlePasswordChangeRequired
    );

    return () =>
      window.removeEventListener(
        "taxfin:password-change-required",
        handlePasswordChangeRequired
      );
  }, []);

  if (authStatus === "loading") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-md">
          <Card>
            <p className="text-center text-slate-300">
              Comprobando acceso...
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (authStatus === "error") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-md">
          <Card className="border-red-500/30">
            <p className="font-bold">
              No pudimos comprobar el acceso
            </p>
            <p className="mt-2 text-sm text-red-300">
              {authError}
            </p>
            <div className="mt-5">
              <Button onClick={checkSession}>Reintentar</Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (authStatus === "anonymous") {
    return (
      <LoginPage
        onAuthenticated={(session) => {
          setCurrentUser(session.user || null);
          setAuthStatus("authenticated");
        }}
      />
    );
  }

  if (currentUser?.mustChangePassword) {
    return (
      <ChangePasswordPage
        currentUser={currentUser}
        onPasswordChanged={(session) =>
          setCurrentUser(session.user)
        }
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Routes>
      <Route
        element={
          <MainLayout
            onLogout={authRequired ? handleLogout : null}
            currentUser={currentUser}
          />
        }
      >
        <Route
          path="/"
          element={<HomePage currentUser={currentUser} />}
        />
        <Route path="/new-work-day" element={<NewWorkDayPage />} />
        <Route path="/new-trip" element={<NewTripPage />} />
        <Route path="/close-work-day" element={<CloseWorkDayPage />} />
        <Route path="/work-day-closed/:id" element={<WorkDayClosedPage />} />
        <Route path="/trips/:id/edit" element={<EditTripPage />} />
        <Route
          path="/history"
          element={<WorkDayHistoryPage currentUser={currentUser} />}
        />
        <Route path="/work-days/:id" element={<WorkDayDetailPage />} />
        {(currentUser?.roles?.isOwner ?? currentUser?.isOwner) && (
          <Route
            path="/drivers"
            element={<DriverManagementPage />}
          />
        )}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PrivateApp />
    </BrowserRouter>
  );
}

export default App;
