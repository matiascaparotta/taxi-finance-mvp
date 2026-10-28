const formatCompactMoney = (value) =>
  Number(value || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const buildTripWhatsAppText = ({
  fareAmount,
  paymentType,
  commission = 0,
  commissionCompanyName = "",
  tip = 0,
  cashPaid = 0,
}) => {
  const paymentCode = paymentType === "cash" ? "E" : "D";
  const adjustments = [];

  if (Number(commission) > 0) {
    adjustments.push(
      `−${formatCompactMoney(commission)} efectivo · comisión${commissionCompanyName ? ` ${commissionCompanyName}` : ""}`
    );
  }

  if (Number(tip) > 0) {
    if (paymentType === "card") {
      adjustments.push(`−${formatCompactMoney(tip)} efectivo · propina`);
    } else {
      adjustments.push(
        `propina ${formatCompactMoney(tip)} · pagó ${formatCompactMoney(cashPaid || Number(fareAmount) + Number(tip))} efectivo`
      );
    }
  }

  return `${formatCompactMoney(fareAmount)} ${paymentCode}${adjustments.length ? ` (${adjustments.join("; ")})` : ""}`;
};

export const shareTripWithWhatsApp = async (text) => {
  const shareData = { title: "Viaje Cuenta 249 Mati", text };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
};
