import { useEffect, useRef, useState } from "react";

import Button from "./ui/Button";
import { createWorkDayShareCards } from "../utils/createWorkDayShareCard";

function WorkDayShareCard({ workDay, summary, trips = [] }) {
  const [shareFiles, setShareFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isSavingImages, setIsSavingImages] = useState(false);
  const sharingLockRef = useRef(false);

  useEffect(() => {
    if (!workDay || !summary) {
      return undefined;
    }

    let isCancelled = false;
    let generatedUrls = [];

    const prepareShareCard = async () => {
      try {
        setIsPreparing(true);
        setShareFiles([]);
        setPreviewUrls([]);
        setMessage("");

        const blobs = await createWorkDayShareCards(
          workDay,
          summary,
          trips
        );

        if (isCancelled) {
          return;
        }

        const dateKey = String(workDay.date).split("T")[0];
        const files = blobs.map(
          (blob, index) =>
            new File(
              [blob],
              index === 0
                ? `taxi-finance-${dateKey}-resumen.png`
                : `taxi-finance-${dateKey}-viajes-${String(
                    index
                  ).padStart(2, "0")}.png`,
              { type: "image/png" }
            )
        );

        generatedUrls = blobs.map((blob) =>
          URL.createObjectURL(blob)
        );
        setShareFiles(files);
        setPreviewUrls(generatedUrls);
      } catch (error) {
        if (!isCancelled) {
          setMessage(error.message);
        }
      } finally {
        if (!isCancelled) {
          setIsPreparing(false);
        }
      }
    };

    prepareShareCard();

    return () => {
      isCancelled = true;

      generatedUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [workDay, summary, trips]);

  const downloadShareFiles = () => {
    shareFiles.forEach((file) => {
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    });
  };

  const handleShare = async () => {
    if (
      sharingLockRef.current ||
      isPreparing ||
      shareFiles.length === 0
    ) {
      return;
    }

    sharingLockRef.current = true;
    setIsSharing(true);
    setMessage("");

    try {
      if (
        navigator.share &&
        navigator.canShare?.({ files: shareFiles })
      ) {
        await navigator.share({
          files: shareFiles,
          title: "Resumen de jornada — Taxi Finance",
        });
        setMessage(
          `${shareFiles.length} ${
            shareFiles.length === 1 ? "imagen compartida" : "imágenes compartidas"
          }`
        );
        return;
      }

      downloadShareFiles();
      setMessage(
        "Tu dispositivo no permite compartir archivos directamente. Las imágenes se descargaron."
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessage("No se pudo compartir la tarjeta");
      }
    } finally {
      sharingLockRef.current = false;
      setIsSharing(false);
    }
  };

  const handleSaveImages = () => {
    if (
      sharingLockRef.current ||
      isPreparing ||
      shareFiles.length === 0
    ) {
      return;
    }

    sharingLockRef.current = true;
    setIsSavingImages(true);
    setMessage("");

    try {
      downloadShareFiles();
      setMessage(
        `${shareFiles.length} ${
          shareFiles.length === 1 ? "imagen guardada" : "imágenes guardadas"
        }`
      );
    } catch {
      setMessage("No se pudieron guardar las imágenes");
    } finally {
      sharingLockRef.current = false;
      setIsSavingImages(false);
    }
  };

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-lg font-bold text-white">
          Tarjeta para compartir
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          El resumen se enviará primero y después el detalle de los viajes.
        </p>
      </div>

      {previewUrls.length > 0 ? (
        <div className="space-y-3">
          <img
            src={previewUrls[0]}
            alt="Vista previa del resumen de jornada"
            className="w-full rounded-3xl border border-emerald-500/30 shadow-xl"
          />

          {previewUrls.length > 1 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-300">
                {previewUrls.length - 1}{" "}
                {previewUrls.length === 2
                  ? "página de viajes"
                  : "páginas de viajes"}
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {previewUrls.slice(1).map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt={`Vista previa de viajes ${index + 1}`}
                    className="w-40 shrink-0 rounded-2xl border border-slate-700"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center text-sm text-slate-400">
          Preparando tarjeta...
        </div>
      )}

      <Button
        onClick={handleShare}
        disabled={isPreparing || isSharing || isSavingImages}
      >
        {isPreparing
          ? "Preparando imágenes..."
          : isSharing
            ? "Abriendo opciones..."
            : shareFiles.length > 1
              ? `Compartir ${shareFiles.length} imágenes`
              : "Compartir tarjeta"}
      </Button>

      <button
        type="button"
        onClick={handleSaveImages}
        disabled={isPreparing || isSharing || isSavingImages}
        className="w-full rounded-2xl border border-slate-700 px-6 py-4 text-lg font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99] disabled:cursor-wait disabled:opacity-50"
      >
        {isSavingImages
          ? "Guardando..."
          : shareFiles.length > 1
            ? "Guardar imágenes"
            : "Guardar imagen"}
      </button>

      {message && (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
          {message}
        </p>
      )}
    </section>
  );
}

export default WorkDayShareCard;
