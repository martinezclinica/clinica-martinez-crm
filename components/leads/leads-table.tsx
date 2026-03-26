"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { updateLeadStatusAction } from "@/app/actions/leads";
import { SubmitButton } from "@/components/auth/submit-button";
import { groupLeadFieldsBySection, formatLeadDetailValue } from "@/lib/leads/detail-view";
import { leadDetailFields, type LeadRecord } from "@/lib/leads/detail";
import {
  getLeadStatusLabel,
  getLeadStatusOptions,
  normalizeLeadStatus,
} from "@/lib/leads/constants";

type LeadsTableProps = {
  leads: LeadRecord[];
  isGlobalSearch: boolean;
  activeRange: string;
  currentPage: number;
  searchQuery: string;
};

function formatLeadDate(value: string | null) {
  if (!value) {
    return "Sin dato";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getStatusBadgeClass(status: string | null) {
  const normalized = normalizeLeadStatus(status);

  if (normalized === "operado") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized === "agendado") {
    return "bg-sky-50 text-sky-700 border-sky-200";
  }

  if (normalized === "cancelado" || normalized === "baneado") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (normalized === "calificado") {
    return "bg-violet-50 text-violet-700 border-violet-200";
  }

  if (normalized === "seguimiento") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
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
              {field.key === "raw_payload" && typeof lead[field.key] === "object" && lead[field.key] !== null ? (
                <pre className="whitespace-pre-wrap break-words text-[0.76rem] leading-6 text-brand-navy">
                  {formatLeadDetailValue(String(field.key), lead[field.key])}
                </pre>
              ) : (
                <p className="break-words">
                  {formatLeadDetailValue(String(field.key), lead[field.key])}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LeadsTable({
  leads,
  isGlobalSearch,
  activeRange,
  currentPage,
  searchQuery,
}: LeadsTableProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  );

  const sections = useMemo(() => groupLeadFieldsBySection(leadDetailFields), []);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[1120px]">
          <div className={`grid px-5 py-2 text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-steel/80 ${
            isGlobalSearch
              ? "grid-cols-[1.15fr_0.95fr_1.15fr_0.9fr_0.9fr_1.1fr]"
              : "grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_0.9fr_1.1fr]"
          }`}>
            <span>Lead</span>
            <span>Celular</span>
            <span>{isGlobalSearch ? "Correo" : "Origen"}</span>
            <span>Especialidad</span>
            <span>Ingreso</span>
            <span>Estado</span>
          </div>

          {leads.map((lead) => {
            const currentStatus = normalizeLeadStatus(lead.status) || "nuevo";
            const statusOptions = getLeadStatusOptions(lead.status);

            return (
              <div
                key={lead.id}
                className={`grid items-center border-t border-[#f1ebe4] px-5 py-1.5 text-[0.84rem] text-brand-navy ${
                  isGlobalSearch
                    ? "grid-cols-[1.15fr_0.95fr_1.15fr_0.9fr_0.9fr_1.1fr]"
                    : "grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_0.9fr_1.1fr]"
                }`}
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedLeadId(lead.id)}
                    className="font-medium leading-5 text-left text-brand-navy underline-offset-4 hover:underline"
                  >
                    {lead.nombre?.trim() || "Sin nombre"}
                  </button>
                </div>

                <div className="text-brand-steel">
                  {lead.celular_completo_con_prefijo || lead.celular_numero || "Sin dato"}
                </div>

                <div className="text-brand-steel">
                  {isGlobalSearch ? (lead.correo || "Sin correo") : (lead.fuente_trafico || "Sin origen")}
                </div>

                <div className="text-brand-steel">
                  {lead.especialidades || "Sin especialidad"}
                </div>

                <div className="text-brand-steel">
                  {formatLeadDate(lead.lead_timestamp)}
                </div>

                <form action={updateLeadStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <input type="hidden" name="page" value={String(currentPage)} />
                  <input type="hidden" name="range" value={activeRange} />
                  <input type="hidden" name="q" value={searchQuery} />
                  <select
                    name="status"
                    defaultValue={currentStatus}
                    className="min-w-[9.5rem] rounded-md border border-[#e5ddd3] bg-white px-2.5 py-1 text-[0.77rem] text-brand-navy outline-none transition focus:border-brand-navy"
                  >
                    {statusOptions.map((statusOption) => (
                      <option key={statusOption.value} value={statusOption.value}>
                        {statusOption.label}
                      </option>
                    ))}
                  </select>
                  <SubmitButton
                    className="rounded-md border border-[#e5ddd3] bg-[#f8f5f1] px-2.5 py-1 text-[0.74rem] font-semibold text-brand-navy transition hover:bg-[#f1ebe4]"
                    pendingLabel="Guardando..."
                  >
                    Guardar
                  </SubmitButton>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[0.66rem] font-semibold ${getStatusBadgeClass(lead.status)}`}
                  >
                    {getLeadStatusLabel(lead.status)}
                  </span>
                </form>
              </div>
            );
          })}
        </div>
      </div>

      {selectedLead ? (
        <div className="fixed inset-0 z-50 bg-[#16243d]/24 backdrop-blur-[2px]">
          <div className="absolute inset-y-3 right-3 flex w-[min(100%,64rem)] max-w-[64rem] overflow-hidden rounded-[1.4rem] border border-[#e6dbcf] bg-[#f8f5f1] shadow-[0_24px_70px_rgba(22,36,61,0.22)]">
            <div className="hidden w-[18rem] flex-col border-r border-[#ece2d8] bg-[#16243d] px-5 py-5 text-white lg:flex">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/55">
                Lead profile
              </p>
              <h2 className="font-heading mt-3 text-[2rem] font-bold tracking-[-0.04em] text-white">
                {selectedLead.nombre?.trim() || "Sin nombre"}
              </h2>
              <p className="mt-2 text-[0.88rem] leading-7 text-white/75">
                {selectedLead.especialidades || "Sin especialidad definida"}
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-[1rem] bg-white/8 px-4 py-3">
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/55">Estado</p>
                  <p className="mt-1 text-sm font-semibold text-white">{getLeadStatusLabel(selectedLead.status)}</p>
                </div>
                <div className="rounded-[1rem] bg-white/8 px-4 py-3">
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/55">Telefono</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedLead.celular_completo_con_prefijo || selectedLead.celular_numero || "Sin dato"}</p>
                </div>
                <div className="rounded-[1rem] bg-white/8 px-4 py-3">
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/55">Correo</p>
                  <p className="mt-1 break-words text-sm font-semibold text-white">{selectedLead.correo || "Sin correo"}</p>
                </div>
                <div className="rounded-[1rem] bg-white/8 px-4 py-3">
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/55">Ingreso</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatLeadDate(selectedLead.lead_timestamp)}</p>
                </div>
              </div>

              <div className="mt-auto pt-5 text-[0.76rem] text-white/62">
                Fuente: {selectedLead.fuente_trafico || "Sin origen"}
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-[#ece2d8] bg-white px-5 py-4">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-brand-steel/60">
                    Detalle del lead
                  </p>
                  <h2 className="font-heading mt-1 text-[1.7rem] font-bold tracking-[-0.04em] text-brand-navy lg:hidden">
                    {selectedLead.nombre?.trim() || "Sin nombre"}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${getStatusBadgeClass(selectedLead.status)}`}>
                      {getLeadStatusLabel(selectedLead.status)}
                    </span>
                    <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-[0.72rem] font-semibold text-brand-navy">
                      {selectedLead.lead_code || "Sin codigo"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/leads/${selectedLead.id}?range=${activeRange}&page=${currentPage}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                    className="rounded-lg border border-[#e5ddd3] bg-white px-3 py-2 text-[0.78rem] font-semibold text-brand-navy transition hover:bg-[#f7efe7]"
                  >
                    Abrir vista completa
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedLeadId(null)}
                    className="rounded-lg border border-[#e5ddd3] bg-[#f8f5f1] px-3 py-2 text-[0.78rem] font-semibold text-brand-navy transition hover:bg-[#f1ebe4]"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
                  <div className="space-y-4">
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <article className="rounded-[1rem] border border-[#ece6de] bg-white px-4 py-3">
                        <p className="text-[0.66rem] uppercase tracking-[0.2em] text-brand-steel/60">Telefono</p>
                        <p className="mt-1.5 text-[0.9rem] font-semibold text-brand-navy">{selectedLead.celular_completo_con_prefijo || selectedLead.celular_numero || "Sin dato"}</p>
                      </article>
                      <article className="rounded-[1rem] border border-[#ece6de] bg-white px-4 py-3">
                        <p className="text-[0.66rem] uppercase tracking-[0.2em] text-brand-steel/60">Correo</p>
                        <p className="mt-1.5 break-words text-[0.9rem] font-semibold text-brand-navy">{selectedLead.correo || "Sin correo"}</p>
                      </article>
                      <article className="rounded-[1rem] border border-[#ece6de] bg-white px-4 py-3 sm:col-span-2 xl:col-span-1">
                        <p className="text-[0.66rem] uppercase tracking-[0.2em] text-brand-steel/60">Especialidad principal</p>
                        <p className="mt-1.5 text-[0.9rem] font-semibold text-brand-navy">{selectedLead.especialidades || "Sin especialidad"}</p>
                      </article>
                    </section>

                    <SectionBlock title="Contacto" fields={sections.contacto} lead={selectedLead} />
                    <SectionBlock title="Seguimiento" fields={sections.seguimiento} lead={selectedLead} />
                  </div>

                  <div className="space-y-4">
                    <SectionBlock title="Seguimiento" fields={sections.seguimiento} lead={selectedLead} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
