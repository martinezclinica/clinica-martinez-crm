import { CrmShell } from "@/components/app-shell/crm-shell";

const metrics = [
  { label: "Presupuesto mensual", value: "$0", note: "Pendiente de carga" },
  { label: "Costo por lead", value: "$0", note: "Se calcula al integrar leads" },
  { label: "Costo por operacion", value: "$0", note: "Se calcula al integrar cierres" },
];

export default async function MarketingCostsPage() {
  return (
    <CrmShell
      activePath="/marketing-costs"
      eyebrow="Marketing"
      title="Costos de marketing"
      description="Esta seccion concentrara gasto publicitario mensual, costo por lead, costo por agenda y costo por operacion."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.75rem] border border-brand-gray/70 bg-white p-6 shadow-[0_18px_40px_rgba(22,36,61,0.06)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-brand-steel/54">
              Indicador
            </p>
            <p className="font-heading mt-4 text-4xl font-bold text-brand-navy">
              {metric.value}
            </p>
            <h2 className="font-heading mt-5 text-xl font-bold text-brand-navy">
              {metric.label}
            </h2>
            <p className="mt-3 text-base leading-7 text-brand-steel">
              {metric.note}
            </p>
          </article>
        ))}
      </div>
    </CrmShell>
  );
}
