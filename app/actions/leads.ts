"use server";

import { revalidatePath } from "next/cache";

import { requireApprovedUser } from "@/lib/auth/session";
import { isLeadStatus, normalizeLeadStatus } from "@/lib/leads/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateLeadStatusAction(formData: FormData) {
  await requireApprovedUser();

  const leadId = String(formData.get("leadId") ?? "").trim();
  const status = normalizeLeadStatus(formData.get("status")?.toString());

  if (!leadId || !isLeadStatus(status)) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (error) {
    console.error("[updateLeadStatusAction] Supabase error", error);
    return;
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
}

