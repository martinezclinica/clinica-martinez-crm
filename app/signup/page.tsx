import Link from "next/link";

import { BrandLockup } from "@/components/auth/brand-lockup";
import SignupForm from "@/components/auth/signup-form";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

const featureItems = [
  "Registro centralizado por correo y rol de trabajo.",
  "Verificacion por correo para activar el acceso.",
  "Aprobacion manual antes de entrar al CRM.",
];

export default async function SignupPage() {
  await redirectAuthenticatedUser();

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden overflow-hidden bg-brand-navy text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(246,205,221,0.12),transparent_22%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_18%_78%,rgba(54,74,111,0.55),transparent_34%),linear-gradient(180deg,#16243d_0%,#1c2b49_100%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.85)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="absolute left-[-8%] top-[14%] h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute bottom-[-6%] right-[-4%] h-72 w-72 rounded-full border border-white/8" />

          <div className="relative flex w-full flex-col justify-center gap-14 px-14 py-16 xl:px-20">
            <div className="max-w-md">
              <span className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
                Acceso privado
              </span>
              <p className="font-heading mt-6 text-5xl font-bold tracking-[-0.03em] text-white">
                Crea tu cuenta
              </p>
              <div className="mt-6 h-px w-24 bg-gradient-to-r from-brand-pink/80 to-transparent" />
              <p className="mt-6 max-w-[32rem] text-[1.15rem] leading-9 text-white/78">
                Esta plataforma centralizara marketing, leads, agendas y
                operaciones de Clinica Martinez dentro de un solo panel.
              </p>
            </div>

            <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 px-7 py-8 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur-[2px]">
              <p className="text-sm uppercase tracking-[0.24em] text-white/48">
                Lo que activa tu acceso
              </p>
              <ul className="mt-6 flex flex-col gap-5">
              {featureItems.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-4 text-lg leading-8 text-white"
                >
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/12 text-base font-semibold">
                    {index === 0 ? "+" : index === 1 ? "~" : "[]"}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#fff9fb_100%)] px-6 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-xl">
            <div className="mb-10 flex justify-center lg:hidden">
              <div className="px-4 py-2">
                <BrandLockup align="center" />
              </div>
            </div>

            <header className="text-center">
              <div className="mb-8 hidden justify-center lg:flex">
                <div className="px-4 py-2">
                  <BrandLockup align="center" />
                </div>
              </div>
              <p className="font-heading text-2xl font-semibold tracking-[-0.02em] text-brand-navy sm:text-3xl">
                Completa tus datos para continuar.
              </p>
            </header>

            <div className="mt-10 px-2 sm:px-4">
              <SignupForm />
              <p className="mt-7 text-center text-base text-brand-steel">
                Ya tienes una cuenta?{" "}
                <Link href="/" className="font-semibold text-brand-navy">
                  Inicia sesion
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
