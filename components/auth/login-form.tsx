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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#ead2c3] px-4 py-6 sm:px-6 sm:py-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth-login-pattern.svg')" }}
      />

      <section className="auth-glow frost-panel relative w-full max-w-[29rem] rounded-[2rem] border border-white/78 bg-white/94 px-6 py-8 shadow-[0_34px_70px_rgba(22,36,61,0.18)] sm:px-8 sm:py-9">
        <div className="mb-8 flex justify-center">
          <BrandLockup align="center" />
        </div>

        <form action={formAction} className="space-y-5">
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
