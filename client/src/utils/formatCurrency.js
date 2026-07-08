export function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  })
    .format(Number(value || 0))
    .replace(/\u00A0/g, " ");
}