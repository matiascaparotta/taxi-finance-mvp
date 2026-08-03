import { apiFetch } from "./apiClient";

const parse = async (response) => {
  const body = await response.json();
  if (!response.ok) throw new Error(body.message);
  return body.data;
};

export const getDriverSettings = async () => parse(await apiFetch("/driver-settings"));
export const saveDriverSettings = async (settings) => parse(await apiFetch("/driver-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) }));
export const addCommissionCompany = async (company) => parse(await apiFetch("/driver-settings/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(company) }));
export const saveCommissionCompany = async (company) => parse(await apiFetch(`/driver-settings/companies/${company.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(company) }));
