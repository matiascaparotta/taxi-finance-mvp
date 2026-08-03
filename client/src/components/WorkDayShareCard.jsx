import { useEffect, useRef, useState } from "react";

import Button from "./ui/Button";
import { createWorkDayShareCard } from "../utils/createWorkDayShareCard";
import {
  getOrganizationFileSlug,
  getWorkDayOrganizationName,
} from "../config/branding";

function WorkDayShareCard({
  workDay,
  summary,
  onCopySummary,
  copyMessage = "",
}) {
  const [shareFiles, setShareFiles] = useState([]);
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
    const prepareShareCard = async () => {
      try {
        setIsPreparing(true);
        setShareFiles([]);
        setMessage("");

        const blob = await createWorkDayShareCard(
          workDay,
          summary
        );

        if (isCancelled) {
          return;
        }

        const dateKey = String(workDay.date).split("T")[0];
        const organizationSlug = getOrganizationFileSlug(workDay);
        setShareFiles([new File(
          [blob],
          `${organizationSlug}-${dateKey}-resumen.png`,
          { type: "image/png" }
        )]);
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

    };
  }, [workDay, summary]);

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
          title: `Resumen de jornada — ${getWorkDayOrganizationName(
            workDay
          )}`,
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
    <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
          Compartir jornada
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">
          Imagen o texto, como prefieras
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Un resumen compacto. El detalle completo permanece en TaxFin.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-xl">↗</div><div><p className="text-sm font-bold text-white">Una imagen de resumen</p><p className="text-xs text-slate-400">Lista para enviar o guardar en el móvil</p></div></div>

      <Button
        onClick={handleShare}
        disabled={isPreparing || isSharing || isSavingImages}
      >
        {isPreparing
          ? "Preparando imágenes..."
          : isSharing
            ? "Abriendo opciones..."
            : "Compartir resumen"}
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleSaveImages}
          disabled={isPreparing || isSharing || isSavingImages}
          className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99] disabled:cursor-wait disabled:opacity-50"
        >
          {isSavingImages
            ? "Guardando..."
            : "Guardar imagen"}
        </button>

        <button
          type="button"
          onClick={onCopySummary}
          className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300 active:scale-[0.99]"
        >
          Copiar texto
        </button>
      </div>

      {message && (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
          {message}
        </p>
      )}

      {copyMessage && (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-semibold text-emerald-300">
          {copyMessage}
        </p>
      )}
    </section>
  );
}

export default WorkDayShareCard;
