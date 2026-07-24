import { useEffect, useState } from "react";

import Button from "./ui/Button";
import { createWorkDayShareCard } from "../utils/createWorkDayShareCard";

function WorkDayShareCard({ workDay, summary, trips = [] }) {
  const [shareFile, setShareFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!workDay || !summary) {
      return undefined;
    }

    let isCancelled = false;
    let generatedUrl = "";

    const prepareShareCard = async () => {
      try {
        setShareFile(null);
        setPreviewUrl("");
        setMessage("");

        const blob = await createWorkDayShareCard(
          workDay,
          summary,
          trips
        );

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
        if (!isCancelled) {
          setMessage(error.message);
        }
      }
    };

    prepareShareCard();

    return () => {
      isCancelled = true;

      if (generatedUrl) {
        URL.revokeObjectURL(generatedUrl);
      }
    };
  }, [workDay, summary, trips]);

  const handleShare = async () => {
    if (!shareFile) {
      setMessage("La tarjeta todavía se está preparando");
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
        setMessage("Tarjeta compartida");
        return;
      }

      const downloadUrl = URL.createObjectURL(shareFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = shareFile.name;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setMessage(
        "Tu dispositivo no permite compartir archivos directamente. La tarjeta se descargó."
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessage("No se pudo compartir la tarjeta");
      }
    }
  };

  return (
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

      <Button onClick={handleShare}>
        Compartir tarjeta
      </Button>

      {message && (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
          {message}
        </p>
      )}
    </section>
  );
}

export default WorkDayShareCard;
