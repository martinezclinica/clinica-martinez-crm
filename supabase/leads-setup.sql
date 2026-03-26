-- Clinica Martinez - Leads setup for Supabase
--
-- Mapping principal desde Google Sheets / CSV:
-- "Lead ID"                    -> legacy_lead_id
-- "timestamp"                  -> lead_timestamp
-- "Anuncio"                    -> anuncio
-- "Status envio a Brevo"       -> status_envio_a_brevo
-- "Meta CAPI"                  -> meta_capi
-- "wpp" / "Llego a wpp"      -> llego_a_wpp
-- "Program" / "TV program"   -> program / tv_program
--
-- Identificador recomendado:
-- - id: UUID canonico para integraciones y relaciones futuras.
-- - lead_code: codigo visible autogenerado y estable para UI.
-- - legacy_lead_id: conserva el identificador historico del Google Sheet.

begin;

create extension if not exists pgcrypto;

create sequence if not exists public.lead_code_seq start with 1000 increment by 1;

create or replace function public.generate_lead_code()
returns text
language plpgsql
as $$
declare
  next_value bigint;
begin
  next_value := nextval('public.lead_code_seq');
  return 'LD-' || lpad(next_value::text, 7, '0');
end;
$$;

create or replace function public.sync_lead_fields()
returns trigger
language plpgsql
as $$
begin
  new.nombre := nullif(btrim(new.nombre), '');
  new.correo := nullif(lower(btrim(new.correo)), '');
  new.celular_numero := nullif(regexp_replace(coalesce(new.celular_numero, ''), '\D', '', 'g'), '');
  new.celular_prefijo := nullif(regexp_replace(coalesce(new.celular_prefijo, ''), '\D', '', 'g'), '');
  new.celular_completo_con_prefijo := nullif(regexp_replace(coalesce(new.celular_completo_con_prefijo, ''), '\D', '', 'g'), '');
  new.legacy_lead_id := nullif(btrim(new.legacy_lead_id), '');
  new.external_id := nullif(btrim(new.external_id), '');
  new.status := coalesce(nullif(lower(btrim(new.status)), ''), 'nuevo');

  if new.celular_completo_con_prefijo is null and new.celular_prefijo is not null and new.celular_numero is not null then
    new.celular_completo_con_prefijo := new.celular_prefijo || new.celular_numero;
  end if;

  if new.celular_numero is null and new.celular_completo_con_prefijo is not null then
    new.celular_numero := new.celular_completo_con_prefijo;
  end if;

  if new.lead_timestamp is null then
    raise exception 'lead_timestamp is required';
  end if;

  if new.celular_numero is null then
    raise exception 'celular_numero is required';
  end if;

  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_code text not null unique default public.generate_lead_code(),
  legacy_lead_id text,
  lead_timestamp timestamptz not null,
  page_url text,
  nombre text,
  correo text,
  celular_numero text not null,
  celular_prefijo text,
  celular_completo_con_prefijo text,
  especialidades text,
  anuncio text,
  tiempo_operacion text,
  en_peru text,
  conoce_dra text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  fuente_trafico text,
  whatsapp_mensaje_template_completo text,
  whatsapp_mensaje_generado text,
  whatsapp_link_generado text,
  client_ip_address text,
  fbclid text,
  user_agent text,
  referer_url text,
  device_type text,
  event_id text,
  fbp text,
  gclid text,
  fbc text,
  external_id text,
  status text not null default 'nuevo',
  value text,
  status_envio_a_brevo text,
  meta_capi boolean,
  em1 text,
  em2 text,
  em3 text,
  em4 text,
  em5 text,
  em6 text,
  em7 text,
  em8 text,
  em9 text,
  llego_a_wpp boolean,
  last_msg_received text,
  consent_asked boolean,
  consent_given boolean,
  program text,
  tv_program boolean,
  ingested_from text not null default 'n8n',
  raw_payload jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists leads_legacy_lead_id_unique_idx
  on public.leads (legacy_lead_id)
  where legacy_lead_id is not null;

create index if not exists leads_timestamp_idx
  on public.leads (lead_timestamp desc);

create index if not exists leads_status_idx
  on public.leads (status);

create index if not exists leads_celular_numero_idx
  on public.leads (celular_numero);

create index if not exists leads_celular_completo_idx
  on public.leads (celular_completo_con_prefijo);

create index if not exists leads_fuente_trafico_idx
  on public.leads (fuente_trafico);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists leads_external_id_idx
  on public.leads (external_id);

drop trigger if exists leads_sync_fields_trigger on public.leads;

create trigger leads_sync_fields_trigger
before insert or update on public.leads
for each row
execute function public.sync_lead_fields();

create or replace function public.is_approved_profile()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.approval_status = 'approved'
  );
$$;

alter table public.leads enable row level security;

drop policy if exists "Approved users can read leads" on public.leads;
create policy "Approved users can read leads"
on public.leads
for select
using (public.is_approved_profile());

drop policy if exists "Approved users can update leads" on public.leads;
create policy "Approved users can update leads"
on public.leads
for update
using (public.is_approved_profile())
with check (public.is_approved_profile());

comment on table public.leads is 'Leads historicos y nuevos de Clinica Martinez. n8n inserta nuevos registros y la app puede actualizar status desde la UI.';
comment on column public.leads.id is 'Identificador canonico para relaciones internas e integraciones.';
comment on column public.leads.lead_code is 'Codigo visible autogenerado para usar en la UI.';
comment on column public.leads.legacy_lead_id is 'Identificador historico importado desde Google Sheets.';
comment on column public.leads.raw_payload is 'Payload opcional crudo para backfills o auditoria de n8n.';

commit;
