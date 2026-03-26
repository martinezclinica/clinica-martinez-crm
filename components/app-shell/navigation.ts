export type CrmNavItem = {
  href: string;
  label: string;
  icon: "dashboard" | "leads" | "appointments" | "operations" | "marketing";
};

export const crmNavItems: CrmNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    href: "/leads",
    label: "Leads",
    icon: "leads",
  },
  {
    href: "/appointments",
    label: "Agendas",
    icon: "appointments",
  },
  {
    href: "/operations",
    label: "Operaciones",
    icon: "operations",
  },
  {
    href: "/marketing-costs",
    label: "Costos de marketing",
    icon: "marketing",
  },
];
