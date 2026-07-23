import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import SectionTitle from "../components/ui/SectionTitle";
import WorkDayTicket from "../components/WorkDayTicket";

import { getWorkDayById } from "../services/workDayService";
import { getWorkDaySummary } from "../services/summaryService";
import { getTripsByWorkDay } from "../services/tripService";
import { createWorkDayShareCard } from "../utils/createWorkDayShareCard";

function WorkDayClosedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workDay, setWorkDay] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareFile, setShareFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!workDay || !summary) {
      return undefined;
    }

    let isCancelled = false;
    let generatedUrl = "";

    const prepareShareCard = async () => {
      try {
        const blob = await createWorkDayShareCard(workDay, summary);

        if (isCancelled) {
          return;
        }

        const file = new File(
          [blob],
          `taxi-finance-${String(workDay.date).split("T")[0]}.png`,
          { type: "image/png" }
        );

        generatedUrl = URL.createObjectURL(blob);
        setShareFile(file);
        setPreviewUrl(generatedUrl);
      } catch (error) {
        setError(error.message);
      }
    };

    prepareShareCard();

    return () => {
      isCancelled = true;

      if (generatedUrl) {
        URL.revokeObjectURL(generatedUrl);
      }
    };
  }, [workDay, summary]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [workDayData, summaryData, tripsData] = await Promise.all([
        getWorkDayById(id),
        getWorkDaySummary(id),
        getTripsByWorkDay(id),
      ]);

      setWorkDay(workDayData);
      setSummary(summaryData);
      setTrips(tripsData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareFile) {
      setShareMessage("La tarjeta todavía se está preparando");
      return;
    }

    try {
      if (
        navigator.share &&
        navigator.canShare?.({ files: [shareFile] })
      ) {
        await navigator.share({
          files: [shareFile],
          title: "Resumen de jornada — Taxi Finance",
        });
        setShareMessage("Tarjeta compartida");
        return;
      }

      const downloadUrl = URL.createObjectURL(shareFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = shareFile.name;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setShareMessage(
        "Tu dispositivo no permite compartir archivos directamente. La tarjeta se descargó."
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareMessage("No se pudo compartir la tarjeta");
      }
    }
  };

  if (loading) {
    return (
      <p className="text-center text-slate-400">
        Cargando jornada...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-400">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-8">
      <SectionTitle
        title="Jornada cerrada"
        subtitle="Resumen final del turno."
      />

      <WorkDayTicket workDay={workDay} summary={summary} trips={trips} />

      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            Tarjeta para compartir
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Esta es la imagen que se enviará.
          </p>
        </div>

        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Vista previa de la tarjeta de jornada"
            className="w-full rounded-3xl border border-emerald-500/30 shadow-xl"
          />
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">
            Preparando tarjeta...
          </div>
        )}
      </section>

      <div className="space-y-3">
        <Button onClick={handleShare}>
          Compartir tarjeta
        </Button>

        {shareMessage && (
          <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
            {shareMessage}
          </p>
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}

export default WorkDayClosedPage;
