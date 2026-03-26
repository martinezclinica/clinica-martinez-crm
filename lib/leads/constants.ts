export const leadStatusOptions = [
  { value: "nuevo", label: "Nuevo" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "calificado", label: "Calificado" },
  { value: "agendado", label: "Agendado" },
  { value: "operado", label: "Operado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "baneado", label: "Baneado" },
] as const;

export type LeadStatus = (typeof leadStatusOptions)[number]["value"];

const leadStatusSet = new Set<string>(leadStatusOptions.map((status) => status.value));

export function normalizeLeadStatus(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isLeadStatus(value: string): value is LeadStatus {
  return leadStatusSet.has(value);
}

export function getLeadStatusLabel(value: string | null | undefined) {
  const normalized = normalizeLeadStatus(value);
  const match = leadStatusOptions.find((status) => status.value === normalized);

  if (match) {
    return match.label;
  }

  if (!normalized) {
    return "Sin estado";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function getLeadStatusOptions(currentStatus: string | null | undefined) {
  const normalized = normalizeLeadStatus(currentStatus);

  if (!normalized || leadStatusSet.has(normalized)) {
    return leadStatusOptions;
  }

  return [
    {
      value: normalized,
      label: getLeadStatusLabel(normalized),
    },
    ...leadStatusOptions,
  ];
}

