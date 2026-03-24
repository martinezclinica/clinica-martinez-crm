import { signOutAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/auth/submit-button";
import { requireApprovedUser } from "@/lib/auth/session";

const cards = [
  {
    title: "Leads entrantes",
    description: "Aqui veras el ingreso consolidado desde WhatsApp, n8n y Evolution API.",
  },
  {
    title: "Agendas y operaciones",
    description: "Este bloque mostrara estados como agendado, operado y cancelado.",
  },
  {
    title: "Gasto de marketing",
    description: "Aqui quedaran los presupuestos, costos mensuales y costo por lead.",
  },
];

export default async function DashboardPage() {
  const { user, profile } = await requireApprovedUser();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_55%)] px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] bg-brand-navy text-white shadow-[0_28px_70px_rgba(22,36,61,0.2)]">
          <div className="grid gap-8 px-7 py-8 sm:px-10 lg:grid-cols-[1.5fr_auto] lg:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/65">
                Dashboard privado
              </p>
              <h1 className="font-heading mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">
                Bienvenido a Clinica Martinez
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">
                Esta es la base del CRM y panel de control publicitario. En la
                siguiente iteracion conectaremos leads, agendas, operaciones y
                metricas desde Supabase.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Sesion
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {profile.full_name ?? user.email}
              </p>
              <p className="mt-2 text-sm text-white/70">{user.email}</p>
              <p className="mt-5 text-sm text-white/80">
                Rol aprobado:{" "}
                <span className="font-semibold text-white">{profile.role}</span>
              </p>
              <form action={signOutAction} className="mt-6">
                <SubmitButton
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-blush hover:text-brand-pink"
                  pendingLabel="Cerrando sesion..."
                >
                  Cerrar sesion
                </SubmitButton>
              </form>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-brand-gray/70 bg-white p-6 shadow-[0_18px_40px_rgba(22,36,61,0.06)]"
            >
              <span className="inline-flex rounded-full bg-brand-blush px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-pink">
                Proximo modulo
              </span>
              <h2 className="font-heading mt-5 text-2xl font-bold text-brand-navy">
                {card.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-brand-steel">
                {card.description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
