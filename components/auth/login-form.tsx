"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/app/actions/auth";
import { BrandLockup } from "@/components/auth/brand-lockup";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthFormState } from "@/lib/auth/forms";

type LoginFormProps = {
  errorCode?: string;
};

function getPageMessage(errorCode?: string) {
  if (errorCode === "confirm") {
    return "El enlace de confirmacion no es valido o ya vencio. Pide un nuevo acceso si lo necesitas.";
  }

  return "";
}

export default function LoginForm({ errorCode }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialAuthFormState);
  const pageMessage = getPageMessage(errorCode);
  const activeMessage = state.message || pageMessage;
  const isError =
    state.status === "error" || (!state.message && Boolean(pageMessage));

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#ead2c3] px-6 py-10 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.7),transparent_24%),radial-gradient(circle_at_18%_24%,rgba(246,205,221,0.28),transparent_30%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.2),transparent_32%),linear-gradient(180deg,#efd8ca_0%,#e4cab9_64%,#b6b0b5_84%,#33405c_100%)]" />
      <div className="absolute inset-x-0 bottom-[-8%] h-[26rem] bg-[radial-gradient(ellipse_at_bottom,rgba(22,36,61,0.7),transparent_60%)]" />
      <div className="absolute left-1/2 top-[10%] h-72 w-72 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />

      <section className="auth-glow frost-panel relative w-full max-w-[29rem] rounded-[2rem] border border-white/75 bg-white/94 px-8 py-9 shadow-[0_34px_70px_rgba(22,36,61,0.18)] sm:px-8">
        <div className="flex justify-center">
          <BrandLockup align="center" />
        </div>

        <form action={formAction} className="mt-9 space-y-5">
          {activeMessage ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                isError
                  ? "border-brand-pink/20 bg-brand-blush/45 text-brand-pink"
                  : "border-brand-navy/12 bg-brand-navy/6 text-brand-navy"
              }`}
            >
              {activeMessage}
            </div>
          ) : null}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-brand-navy"
            >
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="correo@empresa.com"
              className="auth-input h-12 w-full rounded-xl px-4 text-base"
            />
            {state.fieldErrors.email ? (
              <p className="mt-2 text-sm text-brand-pink">
                {state.fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-brand-navy"
            >
              Contrasena
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Escribe tu contrasena"
              className="auth-input h-12 w-full rounded-xl px-4 text-base"
            />
            {state.fieldErrors.password ? (
              <p className="mt-2 text-sm text-brand-pink">
                {state.fieldErrors.password}
              </p>
            ) : null}
          </div>

          <SubmitButton
            className="auth-button w-full rounded-xl px-5 py-3.5 text-base font-semibold text-white"
            pendingLabel="Ingresando..."
          >
            Iniciar sesion
          </SubmitButton>
        </form>

        <div className="mt-7 flex items-center justify-between gap-4 text-sm">
          <a
            href="mailto:soporte@clinica-martinez.lat?subject=Recuperar%20acceso%20Clinica%20Martinez"
            className="auth-link"
          >
            Olvide mi contrasena
          </a>
          <Link href="/signup" className="auth-link font-semibold">
            Crear cuenta
          </Link>
        </div>
      </section>
    </main>
  );
}
