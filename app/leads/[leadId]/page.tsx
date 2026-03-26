import Link from "next/link";
import { notFound } from "next/navigation";

import { CrmShell, type DateFilterValue } from "@/components/app-shell/crm-shell";
import { getLeadStatusLabel } from "@/lib/leads/constants";
import {
  formatLeadDetailValue,
  groupLeadFieldsBySection,
  leadDetailFields,
  type LeadRecord,
} from "@/lib/leads/detail-view";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LeadDetailPageProps = {
  params: Promise<{
    leadId: string;
  }>;
  searchParams: Promise<{
    range?: string | string[];
    page?: string | string[];
    q?: string | string[];
  }>;
};

function parseDateFilter(value: string | string[] | undefined): DateFilterValue {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (normalized === "7d" || normalized === "30d") {
    return normalized;
  }

  return "today";
}

function parseString(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function SectionBlock({
  title,
  fields,
  lead,
}: {
  title: string;
  fields: typeof leadDetailFields;
  lead: LeadRecord;
}) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1rem] border border-[#ece6de] bg-white">
      <div className="border-b border-[#f1ebe4] px-4 py-3">
        <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-brand-steel/70">
          {title}
        </h3>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        {fields.map((field) => (
          <article
            key={String(field.key)}
            className="border-t border-[#f7f1eb] px-4 py-3 first:border-t-0 md:[&:nth-child(2)]:border-t-0"
          >
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-brand-steel/65">
              {field.label}
            </p>
            <div className="mt-1.5 text-[0.84rem] leading-6 text-brand-navy">
              <p className="break-words">
                {formatLeadDetailValue(String(field.key), lead[field.key])}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function LeadDetailPage({ params, searchParams }: LeadDetailPageProps) {
  const { leadId } = await params;
  const resolvedSearchParams = await searchParams;
  const activeRange = parseDateFilter(resolvedSearchParams.range);
  const currentPage = parseString(resolvedSearchParams.page) || "1";
  const searchQuery = parseString(resolvedSearchParams.q);

  const backParams = new URLSearchParams();
  backParams.set("range", activeRange);
  backParams.set("page", currentPage);

  if (searchQuery) {
    backParams.set("q", searchQuery);
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("leads").select("*").eq("id", leadId).maybeSingle();

  if (!data) {
    notFound();
  }

  const lead = data as LeadRecord;
  const sections = groupLeadFieldsBySection(leadDetailFields);

  return (
    <CrmShell
      activePath="/leads"
      activeDateFilter={activeRange}
      dateFilterQuery={searchQuery ? { q: searchQuery } : undefined}
      eyebrow="CRM"
      title={String(lead.nombre || "Lead sin nombre")}
      description={String(lead.correo || lead.celular_completo_con_prefijo || lead.celular_numero || "")}
      headerContent={
        <div className="flex items-center gap-3">
          <Link
            href={`/leads?${backParams.toString()}`}
            className="inline-flex rounded-lg border border-[#e5ddd3] bg-white px-3 py-2 text-[0.82rem] font-semibold text-brand-navy transition hover:bg-[#f7efe7]"
          >
            Volver a leads
          </Link>
          <span className="rounded-full border border-[#eadccf] bg-[#f6f1ea] px-3 py-1 text-[0.76rem] font-semibold text-brand-navy">
            {getLeadStatusLabel(String(lead.status ?? ""))}
          </span>
        </div>
      }
    >
      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <article className="rounded-[1rem] border border-[#ece6de] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(22,36,61,0.035)]">
              <p className="text-[0.66rem] uppercase tracking-[0.2em] text-brand-steel/60">Telefono</p>
              <p className="mt-1.5 text-[0.9rem] font-semibold text-brand-navy">{lead.celular_completo_con_prefijo || lead.celular_numero || "Sin dato"}</p>
            </article>
            <article className="rounded-[1rem] border border-[#ece6de] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(22,36,61,0.035)]">
              <p className="text-[0.66rem] uppercase tracking-[0.2em] text-brand-steel/60">Correo</p>
              <p className="mt-1.5 break-words text-[0.9rem] font-semibold text-brand-navy">{lead.correo || "Sin correo"}</p>
            </article>
            <article className="rounded-[1rem] border border-[#ece6de] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(22,36,61,0.035)] sm:col-span-2 xl:col-span-1">
              <p className="text-[0.66rem] uppercase tracking-[0.2em] text-brand-steel/60">Especialidad principal</p>
              <p className="mt-1.5 text-[0.9rem] font-semibold text-brand-navy">{lead.especialidades || "Sin especialidad"}</p>
            </article>
          </section>

          <SectionBlock title="Contacto" fields={sections.contacto} lead={lead} />
        </div>

        <div className="space-y-4">
          <SectionBlock title="Seguimiento" fields={sections.seguimiento} lead={lead} />
        </div>
      </section>
    </CrmShell>
  );
}
