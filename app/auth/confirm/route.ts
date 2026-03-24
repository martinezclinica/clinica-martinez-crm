import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/wait";

  if (!code) {
    return NextResponse.redirect(new URL("/?error=confirm", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/?error=confirm", request.url));
  }

  const redirectUrl = new URL(next, request.url);
  redirectUrl.searchParams.set("confirmed", "1");

  return NextResponse.redirect(redirectUrl);
}
