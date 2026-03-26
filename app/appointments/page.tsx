import { CrmShell } from "@/components/app-shell/crm-shell";

const agendaBlocks = [
  {
    title: "Por confirmar",
    count: "08",
    description: "Pacientes que ya mostraron interes y necesitan cierre de agenda.",
  },
  {
    title: "Confirmadas",
    count: "14",
    description: "Consultas o valoraciones ya reservadas en calendario.",
  },
  {
    title: "Reagendadas",
    count: "03",
    description: "Casos que cambiaron fecha y requieren seguimiento adicional.",
  },
];

export default async function AppointmentsPage() {
  return (
    <CrmShell
      activePath="/appointments"
      eyebrow="Operativa"
      title="Agendas"
      description="Aqui vas a controlar citas, confirmaciones, reagendamientos y la trazabilidad del proceso comercial hasta la consulta."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {agendaBlocks.map((block) => (
          <article
            key={block.title}
            className="rounded-[1.75rem] border border-brand-gray/70 bg-white p-6 shadow-[0_18px_40px_rgba(22,36,61,0.06)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-brand-steel/56">
              Estado de agenda
            </p>
            <p className="font-heading mt-4 text-5xl font-bold text-brand-navy">
              {block.count}
            </p>
            <h2 className="font-heading mt-5 text-2xl font-bold text-brand-navy">
              {block.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-brand-steel">
              {block.description}
            </p>
          </article>
        ))}
      </div>
    </CrmShell>
  );
}
