import { getLeadStatusLabel } from "@/lib/leads/constants";

import { leadDetailFields, type LeadDetailField, type LeadRecord, type LeadDetailValue } from "./detail";

export { leadDetailFields };
export type { LeadDetailField, LeadRecord, LeadDetailValue };

export function formatLeadDetailValue(key: string, value: LeadDetailValue) {
  if (value === null || value === "") {
    return "Sin dato";
  }

  if (typeof value === "boolean") {
    return value ? "Si" : "No";
  }

  if (key === "status") {
    return getLeadStatusLabel(String(value));
  }

  if (key.includes("timestamp") || key.endsWith("_at")) {
    const date = new Date(String(value));

    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    }
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "Sin dato";
    }
  }

  return String(value);
}

export function groupLeadFieldsBySection(fields: LeadDetailField[]) {
  return {
    contacto: fields.filter((field) => field.section === "contacto"),
    seguimiento: fields.filter((field) => field.section === "seguimiento"),
  };
}
