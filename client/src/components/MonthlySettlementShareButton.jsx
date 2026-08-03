import { useEffect, useRef, useState } from "react";

import { createMonthlySettlementShareCard } from "../utils/createMonthlySettlementShareCard";

function MonthlySettlementShareButton({ settlement }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    createMonthlySettlementShareCard(settlement)
      .then((blob) => {
        if (!cancelled) setFile(new File([blob], `taxfin-liquidacion-${settlement.month}.png`, { type: "image/png" }));
      })
      .catch((error) => { if (!cancelled) setMessage(error.message); });
    return () => { cancelled = true; };
  }, [settlement]);

  const download = () => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    if (!file || lockRef.current) return;
    lockRef.current = true;
    setIsSharing(true);
    setMessage("");
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Liquidación TaxFin — ${settlement.month}` });
        setMessage("Tarjeta compartida");
      } else {
        download();
        setMessage("La tarjeta se guardó como imagen");
      }
    } catch (error) {
      if (error.name !== "AbortError") setMessage("No se pudo compartir la tarjeta");
    } finally {
      lockRef.current = false;
      setIsSharing(false);
    }
  };

  return <div className="space-y-2"><button type="button" onClick={share} disabled={!file || isSharing} className="w-full rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 font-bold text-emerald-200 disabled:opacity-50">{isSharing ? "Abriendo opciones..." : file ? "Compartir liquidación" : "Preparando tarjeta..."}</button>{message && <p className="text-center text-xs font-semibold text-emerald-300">{message}</p>}</div>;
}

export default MonthlySettlementShareButton;
