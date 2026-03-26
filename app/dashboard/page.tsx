import { CrmShell } from "@/components/app-shell/crm-shell";

const topMetrics = [
  {
    title: "Leads",
    value: "128",
    detail: "Leads entrantes del periodo actual.",
  },
  {
    title: "Gasto",
    value: "$2,430",
    detail: "Inversion publicitaria cargada.",
  },
  {
    title: "CPL",
    value: "$18.40",
    detail: "Costo promedio por lead.",
  },
  {
    title: "Costo por agenda",
    value: "$44.10",
    detail: "Relacion entre gasto y citas agendadas.",
  },
  {
    title: "Costo por operacion",
    value: "$270.00",
    detail: "Relacion entre gasto y operaciones cerradas.",
  },
];

const latestLeads = [
  {
    name: "Andrea Gomez",
    source: "WhatsApp",
    status: "Nuevo",
    owner: "Sin asignar",
    createdAt: "24/03/2026 10:14",
  },
  {
    name: "Camila Ruiz",
    source: "Meta Ads",
    status: "Seguimiento",
    owner: "Ventas 1",
    createdAt: "24/03/2026 09:36",
  },
  {
    name: "Maria Vega",
    source: "Referido",
    status: "Calificado",
    owner: "Ventas 2",
    createdAt: "24/03/2026 08:52",
  },
  {
    name: "Daniela Torres",
    source: "WhatsApp",
    status: "Agendado",
    owner: "Ventas 1",
    createdAt: "23/03/2026 18:20",
  },
];

export default async function DashboardPage() {
  return (
    <CrmShell
      activePath="/dashboard"
      eyebrow="Vista general"
      title="Dashboard"
      description="Resumen ejecutivo del rendimiento comercial y publicitario de Clinica Martinez."
    >
      <section className="grid gap-3 xl:grid-cols-5">
        {topMetrics.map((metric) => (
          <article
            key={metric.title}
            className="rounded-[1rem] border border-[#ece6de] bg-white px-4 py-4 shadow-[0_6px_18px_rgba(22,36,61,0.035)]"
          >
            <p className="text-[0.88rem] text-brand-steel">{metric.title}</p>
            <p className="font-heading mt-2 text-[2rem] font-bold tracking-[-0.05em] text-brand-navy">
              {metric.value}
            </p>
            <p className="mt-2 text-[0.82rem] leading-6 text-brand-steel">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[1.1rem] border border-[#ece6de] bg-white shadow-[0_6px_18px_rgba(22,36,61,0.035)]">
        <div className="flex flex-col gap-2 border-b border-[#f1ebe4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-[1.6rem] font-bold tracking-[-0.045em] text-brand-navy">
              Ultimos leads
            </h2>
            <p className="mt-1 text-[0.84rem] text-brand-steel">
              Entradas recientes para seguimiento del equipo comercial.
            </p>
          </div>
          <p className="text-[0.8rem] text-brand-steel">Actualizado hoy</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_1fr] px-5 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-brand-steel/70">
              <span>Lead</span>
              <span>Origen</span>
              <span>Estado</span>
              <span>Responsable</span>
              <span>Ingreso</span>
            </div>

            {latestLeads.map((lead) => (
              <div
                key={`${lead.name}-${lead.createdAt}`}
                className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_1fr] items-center border-t border-[#f1ebe4] px-5 py-4 text-[0.88rem] text-brand-navy"
              >
                <span className="font-medium text-brand-navy">{lead.name}</span>
                <span className="text-brand-steel">{lead.source}</span>
                <span>
                  <span className="rounded-full bg-[#f6f1ea] px-2.5 py-1 text-[0.74rem] font-semibold text-brand-navy">
                    {lead.status}
                  </span>
                </span>
                <span className="text-brand-steel">{lead.owner}</span>
                <span className="text-brand-steel">{lead.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CrmShell>
  );
}
