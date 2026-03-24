"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthFormState } from "@/lib/auth/forms";
import { getCurrentUserProfile, getPostLoginPath } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function createErrorState(
  message: string,
  fieldErrors: AuthFormState["fieldErrors"] = {},
): AuthFormState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mapAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Correo o contrasena invalidos.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesion.";
  }

  if (normalized.includes("user already registered")) {
    return "Ya existe una cuenta con ese correo.";
  }

  return "No pudimos completar la operacion. Intenta de nuevo.";
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (!email) {
    fieldErrors.email = "Ingresa tu correo.";
  } else if (!isEmailValid(email)) {
    fieldErrors.email = "Ingresa un correo valido.";
  }

  if (!password) {
    fieldErrors.password = "Ingresa tu contrasena.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return createErrorState("Revisa los campos marcados.", fieldErrors);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return createErrorState(mapAuthError(error.message));
  }

  const { profile } = await getCurrentUserProfile();

  redirect(getPostLoginPath(profile));
}

export async function signupAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (!fullName || fullName.length < 3) {
    fieldErrors.fullName = "Ingresa tu nombre completo.";
  }

  if (!email) {
    fieldErrors.email = "Ingresa tu correo.";
  } else if (!isEmailValid(email)) {
    fieldErrors.email = "Ingresa un correo valido.";
  }

  if (!password) {
    fieldErrors.password = "Crea una contrasena.";
  } else if (password.length < 8) {
    fieldErrors.password = "La contrasena debe tener al menos 8 caracteres.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return createErrorState("Revisa los campos marcados.", fieldErrors);
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const siteUrl = origin ?? getSiteUrl();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/wait`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return createErrorState(mapAuthError(error.message));
  }

  if (data.user?.identities?.length === 0) {
    return createErrorState("Ya existe una cuenta con ese correo.");
  }

  return {
    status: "success",
    message:
      "Te enviamos un correo de confirmacion. Cuando lo abras, tu cuenta quedara en espera de aprobacion.",
    fieldErrors: {},
  };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  redirect("/");
}
