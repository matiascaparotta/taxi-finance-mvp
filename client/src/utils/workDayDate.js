export function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCloseDateOptions(now = new Date()) {
  const today = new Date(now);
  const yesterday = new Date(now);

  yesterday.setDate(yesterday.getDate() - 1);

  return {
    today: formatLocalDate(today),
    yesterday: formatLocalDate(yesterday),
  };
}

export function normalizeWorkDayDate(date) {
  if (typeof date !== "string" || !date) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? "" : formatLocalDate(parsedDate);
}
