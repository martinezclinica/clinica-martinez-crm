export type LeadDetailValue = string | boolean | number | null | Record<string, unknown> | unknown[];

export type LeadRecord = {
  id: string;
  lead_code: string | null;
  legacy_lead_id: string | null;
  lead_timestamp: string | null;
  nombre: string | null;
  correo: string | null;
  celular_numero: string | null;
  celular_prefijo: string | null;
  celular_completo_con_prefijo: string | null;
  especialidades: string | null;
  anuncio: string | null;
  tiempo_operacion: string | null;
  en_peru: string | null;
  conoce_dra: string | null;
  page_url: string | null;
  fuente_trafico: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  client_ip_address: string | null;
  fbclid: string | null;
  gclid: string | null;
  fbc: string | null;
  fbp: string | null;
  external_id: string | null;
  event_id: string | null;
  user_agent: string | null;
  referer_url: string | null;
  device_type: string | null;
  status: string | null;
  value: string | null;
  status_envio_a_brevo: string | null;
  meta_capi: boolean | null;
  llego_a_wpp: boolean | null;
  tv_program: boolean | null;
  program: string | null;
  last_msg_received: string | null;
  consent_asked: boolean | null;
  consent_given: boolean | null;
  whatsapp_mensaje_template_completo: string | null;
  whatsapp_mensaje_generado: string | null;
  whatsapp_link_generado: string | null;
  em1: string | null;
  em2: string | null;
  em3: string | null;
  em4: string | null;
  em5: string | null;
  em6: string | null;
  em7: string | null;
  em8: string | null;
  em9: string | null;
  ingested_from: string | null;
  raw_payload: Record<string, unknown> | unknown[] | null;
  created_at: string | null;
  updated_at: string | null;
  [key: string]: LeadDetailValue;
};

export type LeadDetailField = {
  key: keyof LeadRecord;
  label: string;
  section: "contacto" | "seguimiento";
};

export const leadDetailFields: LeadDetailField[] = [
  { key: "lead_timestamp", label: "Timestamp", section: "contacto" },
  { key: "nombre", label: "Nombre", section: "contacto" },
  { key: "correo", label: "Correo", section: "contacto" },
  { key: "celular_numero", label: "Numero", section: "contacto" },
  { key: "celular_prefijo", label: "Prefijo", section: "contacto" },
  { key: "celular_completo_con_prefijo", label: "Numero completo", section: "contacto" },
  { key: "especialidades", label: "Especialidades", section: "contacto" },
  { key: "tiempo_operacion", label: "Tiempo operacion", section: "contacto" },
  { key: "en_peru", label: "En Peru", section: "contacto" },
  { key: "conoce_dra", label: "Conoce a la dra", section: "contacto" },
  { key: "status", label: "Status", section: "seguimiento" },
  { key: "value", label: "Value", section: "seguimiento" },
  { key: "status_envio_a_brevo", label: "Status envio a Brevo", section: "seguimiento" },
  { key: "meta_capi", label: "Meta CAPI", section: "seguimiento" },
  { key: "llego_a_wpp", label: "Llego a wpp", section: "seguimiento" },
  { key: "tv_program", label: "TV program", section: "seguimiento" },
  { key: "program", label: "Program", section: "seguimiento" },
  { key: "last_msg_received", label: "Last msg received", section: "seguimiento" },
  { key: "consent_asked", label: "Consent asked", section: "seguimiento" },
  { key: "consent_given", label: "Consent given", section: "seguimiento" },
  { key: "whatsapp_mensaje_generado", label: "WhatsApp mensaje generado", section: "seguimiento" },
  { key: "whatsapp_link_generado", label: "WhatsApp link generado", section: "seguimiento" },
];
