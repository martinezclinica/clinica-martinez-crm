import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
  requested_role: string;
  role: string;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
};

export async function getCurrentUserProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, requested_role, role, approval_status, created_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile: error ? null : (data as ProfileRow | null),
  };
}

export function getPostLoginPath(profile: ProfileRow | null) {
  if (profile?.approval_status === "approved") {
    return "/dashboard";
  }

  if (profile?.approval_status === "rejected") {
    return "/wait?status=rejected";
  }

  if (!profile) {
    return "/wait?status=setup";
  }

  return "/wait";
}

export async function redirectAuthenticatedUser() {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    return;
  }

  redirect(getPostLoginPath(profile));
}

export async function requireApprovedUser() {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    redirect("/");
  }

  if (profile?.approval_status !== "approved") {
    redirect(getPostLoginPath(profile));
  }

  return {
    user,
    profile,
  };
}
