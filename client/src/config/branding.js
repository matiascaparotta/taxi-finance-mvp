export const APP_NAME = "TaxFin";
export const DEFAULT_ORGANIZATION_NAME = "Lic249";

export const getWorkDayOrganizationName = (workDay) =>
  workDay?.organizationName || DEFAULT_ORGANIZATION_NAME;

export const getOrganizationFileSlug = (workDay) =>
  getWorkDayOrganizationName(workDay)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
