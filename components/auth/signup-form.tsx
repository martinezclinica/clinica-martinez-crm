"use client";

import { useActionState } from "react";

import { signupAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/auth/submit-button";
import { initialAuthFormState } from "@/lib/auth/forms";

export default function SignupForm() {
  const [state, formAction] = useActionState(
    signupAction,
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
            state.status === "success"
              ? "border-brand-navy/12 bg-brand-navy/6 text-brand-navy"
              : "border-brand-blush bg-brand-blush/55 text-brand-pink"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-semibold text-brand-navy"
        >
          Nombre
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre completo"
          className="auth-input h-12 w-full rounded-xl px-4 text-base"
        />
        {state.fieldErrors.fullName ? (
          <p className="mt-2 text-sm text-brand-pink">
            {state.fieldErrors.fullName}
          </p>
        ) : null}
      </div>

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
          autoComplete="new-password"
          placeholder="Crea una contrasena"
          className="auth-input h-12 w-full rounded-xl px-4 text-base"
        />
        <p className="mt-2 text-sm text-brand-steel">Minimo 8 caracteres.</p>
        {state.fieldErrors.password ? (
          <p className="mt-2 text-sm text-brand-pink">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <SubmitButton
        className="auth-button w-full rounded-xl px-5 py-3.5 text-base font-semibold text-white"
        pendingLabel="Creando cuenta..."
      >
        Crear cuenta
      </SubmitButton>
    </form>
  );
}
