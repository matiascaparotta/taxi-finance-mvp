const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getAllowedCloseDates = (now = new Date()) => {
  const today = new Date(now);
  const yesterday = new Date(now);

  yesterday.setDate(yesterday.getDate() - 1);

  return [formatLocalDate(today), formatLocalDate(yesterday)];
};

const validateCloseDate = (date, now = new Date()) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Confirma si la jornada corresponde a hoy o ayer");
  }

  if (!getAllowedCloseDates(now).includes(date)) {
    throw new Error("La fecha de cierre solo puede ser hoy o ayer");
  }

  return date;
};

module.exports = {
  formatLocalDate,
  getAllowedCloseDates,
  validateCloseDate,
};
