export function getDisplayedCash(summary) {
  return Number(summary?.cashRevenue ?? summary?.realCash ?? summary?.cash ?? 0);
}
