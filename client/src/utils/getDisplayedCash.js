export function getDisplayedCash(summary) {
  return Number(summary?.realCash ?? summary?.cash ?? 0);
}
