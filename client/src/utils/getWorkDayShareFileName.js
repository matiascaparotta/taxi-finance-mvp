import { getWorkDayOrganizationName } from "../config/branding.js";

const sanitizeFilePart = (value) =>
  String(value || "")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

const formatWorkDayDate = (value) => {
  const dateKey = String(value || "").split("T")[0];
  const [year, month, day] = dateKey.split("-");

  if (!year || !month || !day) {
    return sanitizeFilePart(dateKey) || "sin fecha";
  }

  return `${day}-${month}-${year}`;
};

export const getWorkDaySharePdfFileName = (workDay) => {
  const date = formatWorkDayDate(workDay?.date);
  const license = sanitizeFilePart(getWorkDayOrganizationName(workDay));

  return `Jornada ${date} - ${license}.pdf`;
};

