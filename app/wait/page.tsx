import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/actions/auth";
import { BrandLockup } from "@/components/auth/brand-lockup";
import { SubmitButton } from "@/components/auth/submit-button";
import { WaitAutoRefresh } from "@/components/auth/wait-auto-refresh";
import { getCurrentUserProfile } from "@/lib/auth/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getWaitMessage(status: string | undefined, confirmed: string | undefined) {
  if (status === "rejected") {
    return {
      title: "Tu acceso aun no fue aprobado",
      body: "Un administrador debe revisar tu solicitud. Si crees que esto es un error, contacta al equipo encargado.",
      tone: "rose",
    } as const;
  }

  if (status === "setup") {
    return {
      title: "Tu cuenta ya existe y esta en revision",
      body: "Aun no encontramos un perfil aprobado para este usuario. Apenas un administrador lo habilite, podras entrar al dashboard.",
      tone: "blue",
    } as const;
  }

  if (confirmed === "1") {
    return {
      title: "Correo confirmado correctamente",
      body: "Tu cuenta quedo validada. Ahora solo falta la aprobacion del administrador para entrar a la plataforma.",
      tone: "blue",
    } as const;
  }

  return {
    title: "Estamos esperando la aprobacion del administrador",
    body: "Cuando tu acceso sea aprobado, al iniciar sesion entraras directo al dashboard.",
    tone: "blue",
  } as const;
}

export default async function WaitPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    redirect("/");
  }

  if (profile?.approval_status === "approved") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const status = getSearchParam(params.status);
  const confirmed = getSearchParam(params.confirmed);
  const message = getWaitMessage(status, confirmed);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(246,205,221,0.55),transparent_28%),linear-gradient(180deg,#fff8f4_0%,#f7f9fc_100%)] px-6 py-12">
      <section className="auth-glow frost-panel w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/88 p-7 sm:p-10">
        <div className="flex justify-center">
          <BrandLockup align="center" />
        </div>

        <div className="mt-10 text-center">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              message.tone === "rose"
                ? "bg-brand-blush text-brand-pink"
                : "bg-brand-navy/8 text-brand-navy"
            }`}
          >
            Estado del acceso
          </span>
          <h1 className="font-heading mt-5 text-3xl font-bold tracking-[-0.03em] text-brand-navy sm:text-4xl">
            {message.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-brand-steel">
            {message.body}
          </p>
          <WaitAutoRefresh />
        </div>

        <div className="mt-10 grid gap-4 rounded-[1.5rem] border border-brand-gray/70 bg-brand-ivory/80 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-steel/70">
              Correo
            </p>
            <p className="mt-2 text-base font-semibold text-brand-navy">
              {user.email}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-steel/70">
              Rol
            </p>
            <p className="mt-2 text-base font-semibold text-brand-navy">
              Se asigna al aprobar
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <form action={signOutAction} className="flex-1">
            <SubmitButton
              className="w-full rounded-2xl border border-brand-navy bg-brand-navy px-5 py-4 text-base font-semibold text-white transition hover:bg-brand-steel"
              pendingLabel="Cerrando sesion..."
            >
              Cerrar sesion
            </SubmitButton>
          </form>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center rounded-2xl border border-brand-gray bg-white px-5 py-4 text-base font-semibold text-brand-navy transition hover:border-brand-pink hover:text-brand-pink"
          >
            Volver al login
          </Link>
        </div>
      </section>
    </main>
  );
}
