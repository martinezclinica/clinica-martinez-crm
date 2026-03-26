import Link from "next/link";

import { CrmShell, type DateFilterValue } from "@/components/app-shell/crm-shell";
import { LeadSearchInput } from "@/components/leads/lead-search-input";
import { LeadsTable } from "@/components/leads/leads-table";
import type { LeadRecord } from "@/lib/leads/detail";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LeadSpecialtyRow = {
  especialidades: string | null;
};

type LeadsPageProps = {
  searchParams: Promise<{
    range?: string | string[];
    page?: string | string[];
    q?: string | string[];
  }>;
};

const PAGE_SIZE = 20;

function parseDateFilter(value: string | string[] | undefined): DateFilterValue {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (normalized === "7d" || normalized === "30d") {
    return normalized;
  }

  return "today";
}

function parsePage(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(normalized ?? "1", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function parseSearchQuery(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return (normalized ?? "").trim();
}

function getRangeStart(range: DateFilterValue) {
  const bogotaDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const start = new Date(`${bogotaDay}T00:00:00-05:00`);

  if (range === "7d") {
    start.setDate(start.getDate() - 6);
  }

  if (range === "30d") {
    start.setDate(start.getDate() - 29);
  }

  return start.toISOString();
}

function getLeadsHref(range: DateFilterValue, page: number, query: string) {
  const params = new URLSearchParams();
  params.set("range", range);
  params.set("page", String(page));

  if (query) {
    params.set("q", query);
  }

  return `/leads?${params.toString()}`;
}

function getTopProcedures(rows: LeadSpecialtyRow[]) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const value = row.especialidades?.trim();

    if (!value) {
      continue;
    }

    for (const rawPart of value.split(/[;,/|]+/)) {
      const part = rawPart.trim();

      if (!part) {
        continue;
      }

      counts.set(part, (counts.get(part) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, total]) => ({ name, total }));
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeRange = parseDateFilter(resolvedSearchParams.range);
  const currentPage = parsePage(resolvedSearchParams.page);
  const searchQuery = parseSearchQuery(resolvedSearchParams.q);
  const rangeStart = getRangeStart(activeRange);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const isGlobalSearch = searchQuery.length > 0;

  const supabase = await createSupabaseServerClient();

  const leadsQuery = supabase
    .from("leads")
    .select("*", { count: "exact" });

  const specialtiesQuery = supabase.from("leads").select("especialidades");

  if (!isGlobalSearch) {
    leadsQuery.gte("lead_timestamp", rangeStart);
    specialtiesQuery.gte("lead_timestamp", rangeStart);
  }

  if (searchQuery) {
    const escapedQuery = searchQuery.replaceAll(",", "\\,");
    const orFilter = `nombre.ilike.%${escapedQuery}%,correo.ilike.%${escapedQuery}%,celular_numero.ilike.%${escapedQuery}%,celular_completo_con_prefijo.ilike.%${escapedQuery}%`;
    leadsQuery.or(orFilter);
    specialtiesQuery.or(orFilter);
  }

  const [{ data, error, count }, { data: specialtyRows, error: specialtiesError }] = await Promise.all([
    leadsQuery.order("lead_timestamp", { ascending: false }).range(from, to),
    specialtiesQuery,
  ]);

  const leads = (data ?? []) as LeadRecord[];
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const topProcedures = specialtiesError
    ? []
    : getTopProcedures((specialtyRows ?? []) as LeadSpecialtyRow[]);

  return (
    <CrmShell
      activePath="/leads"
      activeDateFilter={activeRange}
      dateFilterQuery={searchQuery ? { q: searchQuery } : undefined}
      eyebrow="CRM"
      title="Leads"
      headerContent={
        <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[0.9rem] border border-[#ece6de] bg-white px-3.5 py-3 shadow-[0_5px_14px_rgba(22,36,61,0.03)]">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-brand-steel/60">
              Cantidad de leads
            </p>
            <p className="font-heading mt-1.5 text-[1.8rem] font-bold tracking-[-0.05em] text-brand-navy">
              {totalCount}
            </p>
            <p className="mt-0.5 text-[0.76rem] text-brand-steel">
              {isGlobalSearch ? "Resultados globales de la busqueda." : "Total del filtro seleccionado."}
            </p>
          </article>

          <article className="rounded-[0.9rem] border border-[#ece6de] bg-white px-3.5 py-3 shadow-[0_5px_14px_rgba(22,36,61,0.03)]">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-brand-steel/60">
              Top 3 procedimientos mas solicitados
            </p>
            <div className="mt-2.5 space-y-1.5">
              {topProcedures.length > 0 ? (
                topProcedures.map((procedure, index) => (
                  <div key={procedure.name} className="flex items-center justify-between rounded-lg bg-[#faf7f3] px-3 py-2">
                    <span className="text-[0.8rem] text-brand-navy">
                      {index + 1}. {procedure.name}
                    </span>
                    <span className="text-[0.74rem] font-semibold text-brand-steel">
                      {procedure.total}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[0.76rem] text-brand-steel">Sin datos suficientes para esta vista.</p>
              )}
            </div>
          </article>
        </div>
      }
    >
      <section className="rounded-[1.1rem] border border-[#ece6de] bg-white shadow-[0_6px_18px_rgba(22,36,61,0.035)]">
        <div className="flex flex-col gap-3 border-b border-[#f1ebe4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <LeadSearchInput
            initialQuery={searchQuery}
            activeRange={activeRange}
          />
          <p className="text-[0.8rem] text-brand-steel">
            {error
              ? "No se pudo cargar la tabla"
              : isGlobalSearch
                ? `${totalCount} resultados globales`
                : `${totalCount} leads en este filtro`}
          </p>
        </div>

        {error ? (
          <div className="px-5 py-10 text-sm text-rose-700">
            No se pudo consultar la tabla `leads`. Verifica que el SQL de Supabase ya este ejecutado.
          </div>
        ) : leads.length === 0 ? (
          <div className="px-5 py-10 text-sm text-brand-steel">
            No hay leads para este rango o para esa busqueda. Ajusta el filtro e intenta nuevamente.
          </div>
        ) : (
          <>
            <LeadsTable
              leads={leads}
              isGlobalSearch={isGlobalSearch}
              activeRange={activeRange}
              currentPage={currentPage}
              searchQuery={searchQuery}
            />

            <div className="flex flex-col gap-3 border-t border-[#f1ebe4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.82rem] text-brand-steel">
                Pagina {Math.min(currentPage, totalPages)} de {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <Link
                  href={hasPreviousPage ? getLeadsHref(activeRange, currentPage - 1, searchQuery) : "#"}
                  aria-disabled={!hasPreviousPage}
                  className={`rounded-lg border px-3 py-2 text-[0.8rem] font-semibold transition ${
                    hasPreviousPage
                      ? "border-[#e5ddd3] bg-white text-brand-navy hover:bg-[#f7efe7]"
                      : "cursor-not-allowed border-[#eee7df] bg-[#faf7f3] text-brand-steel/50"
                  }`}
                >
                  Anterior
                </Link>
                <Link
                  href={hasNextPage ? getLeadsHref(activeRange, currentPage + 1, searchQuery) : "#"}
                  aria-disabled={!hasNextPage}
                  className={`rounded-lg border px-3 py-2 text-[0.8rem] font-semibold transition ${
                    hasNextPage
                      ? "border-[#e5ddd3] bg-white text-brand-navy hover:bg-[#f7efe7]"
                      : "cursor-not-allowed border-[#eee7df] bg-[#faf7f3] text-brand-steel/50"
                  }`}
                >
                  Siguiente
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
    </CrmShell>
  );
}
