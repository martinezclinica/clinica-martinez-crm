import { CrmShell } from "@/components/app-shell/crm-shell";

const operationStages = [
  "Prequirurgico",
  "Programadas",
  "Operadas",
  "Post operatorio",
];

export default async function OperationsPage() {
  return (
    <CrmShell
      activePath="/operations"
      eyebrow="Clinica"
      title="Operaciones"
      description="Este modulo sera la vista de control para operaciones esteticas: programacion, confirmacion, estatus y seguimiento posterior."
    >
      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[1.75rem] border border-brand-gray/70 bg-white p-6 shadow-[0_18px_40px_rgba(22,36,61,0.06)]">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-steel/56">
            Funnel quirurgico
          </p>
          <div className="mt-6 space-y-3">
            {operationStages.map((stage, index) => (
              <div
                key={stage}
                className="flex items-center justify-between rounded-2xl border border-brand-gray/60 bg-brand-ivory/72 px-4 py-4"
              >
                <span className="font-semibold text-brand-navy">{stage}</span>
                <span className="text-sm text-brand-steel">0{index + 2}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-brand-gray/70 bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] p-6 shadow-[0_18px_40px_rgba(22,36,61,0.06)]">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-steel/56">
            Siguiente fase
          </p>
          <h2 className="font-heading mt-4 text-3xl font-bold text-brand-navy">
            Aqui conectaremos resultados reales por paciente.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-brand-steel">
            Una vez tengamos la tabla operativa en Supabase, esta vista mostrara fecha, tipo de operacion, medico, ingreso asociado y estado del caso clinico.
          </p>
        </article>
      </section>
    </CrmShell>
  );
}
