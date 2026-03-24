export function getSupabaseEnv() {
  return {
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://your-project-ref.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "your-anon-key",
  };
}

export function getSiteUrl() {
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    "https://www.clinica-martinez.lat";

  const normalizedSiteUrl = rawSiteUrl.replace(/\/$/, "");

  if (
    normalizedSiteUrl.startsWith("http://") ||
    normalizedSiteUrl.startsWith("https://")
  ) {
    return normalizedSiteUrl;
  }

  return `https://${normalizedSiteUrl}`;
}
