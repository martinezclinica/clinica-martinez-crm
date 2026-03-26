import Image from "next/image";
import Link from "next/link";

import { signOutAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/auth/submit-button";

import { crmNavItems, type CrmNavItem } from "./navigation";

type CrmSidebarProps = {
  activePath: string;
  email: string;
  name: string;
  role: string;
};

function NavIcon({ icon }: { icon: CrmNavItem["icon"] }) {
  const className = "h-4 w-4 text-current";

  if (icon === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <rect x="4" y="4" width="7" height="7" rx="1.4" />
        <rect x="13" y="4" width="7" height="7" rx="1.4" />
        <rect x="4" y="13" width="7" height="7" rx="1.4" />
        <rect x="13" y="13" width="7" height="7" rx="1.4" />
      </svg>
    );
  }

  if (icon === "leads") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M7 5h10" />
        <path d="M7 12h10" />
        <path d="M7 19h10" />
        <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none" />
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "appointments") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M8 3v6" />
        <path d="M16 3v6" />
        <path d="M4 10h16" />
      </svg>
    );
  }

  if (icon === "operations") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M6 6l12 12" />
        <path d="M15 5l4 4" />
        <path d="M5 15l4 4" />
        <path d="M14 10l-4-4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 18h14" />
      <path d="M8 18V9" />
      <path d="M12 18V6" />
      <path d="M16 18v-4" />
    </svg>
  );
}

function SidebarLinks({ activePath }: { activePath: string }) {
  return (
    <nav className="space-y-1">
      {crmNavItems.map((item) => {
        const isActive = activePath === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.94rem] transition ${
              isActive
                ? "bg-[#f3e8de] font-medium text-brand-navy"
                : "text-brand-steel hover:bg-[#faf1e9] hover:text-brand-navy"
            }`}
          >
            <span className="inline-flex h-4 w-4 items-center justify-center text-current">
              <NavIcon icon={item.icon} />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function CrmSidebar({
  activePath,
  email,
  name,
  role,
}: CrmSidebarProps) {
  return (
    <>
      <aside className="hidden h-screen flex-col overflow-y-auto border-r border-[#ede2d7] bg-[#fffdfa] px-3 py-4 lg:sticky lg:top-0 lg:flex">
        <div className="px-2">
          <Image
            src="/logo-omni-agencia.png"
            alt="Omni Agencia"
            width={146}
            height={46}
            priority
          />
          <p className="mt-2 text-[0.67rem] uppercase tracking-[0.3em] text-brand-steel/58">
            Clinica Martinez
          </p>
        </div>

        <div className="mt-6 px-1">
          <p className="mb-3 px-2 text-[0.68rem] uppercase tracking-[0.24em] text-brand-steel/56">
            Principal
          </p>
          <SidebarLinks activePath={activePath} />
        </div>

        <div className="mt-auto border-t border-[#ede2d7] px-1 pt-4">
          <p className="mb-3 px-2 text-[0.68rem] uppercase tracking-[0.24em] text-brand-steel/56">
            Cuenta
          </p>
          <div className="rounded-[1rem] border border-[#eadccf] bg-[#fffaf5] px-3 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1dfd1] text-xs font-semibold text-brand-navy">
                {name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-navy">{name}</p>
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-brand-steel/58">
                  {role}
                </p>
              </div>
            </div>
            <p className="mt-3 break-all text-[0.82rem] text-brand-steel">{email}</p>
            <form action={signOutAction} className="mt-3">
              <SubmitButton
                className="w-full rounded-xl border border-[#e2d2c5] bg-white px-3 py-2.5 text-[0.82rem] font-semibold text-brand-navy transition hover:bg-[#f7efe7]"
                pendingLabel="Cerrando sesion..."
              >
                Cerrar sesion
              </SubmitButton>
            </form>
          </div>
        </div>
      </aside>

      <div className="border-b border-[#ede2d7] bg-[#fffdfa] px-4 py-4 lg:hidden sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Image
              src="/logo-omni-agencia.png"
              alt="Omni Agencia"
              width={128}
              height={40}
              priority
            />
            <p className="mt-2 text-[0.66rem] uppercase tracking-[0.28em] text-brand-steel/58">
              Clinica Martinez
            </p>
          </div>
          <form action={signOutAction}>
            <SubmitButton
              className="rounded-xl border border-[#eadccf] bg-white px-3.5 py-2 text-[0.82rem] font-semibold text-brand-navy transition hover:bg-[#f7efe7]"
              pendingLabel="Saliendo..."
            >
              Salir
            </SubmitButton>
          </form>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {crmNavItems.map((item) => {
            const isActive = activePath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[0.82rem] font-semibold transition ${
                  isActive
                    ? "bg-[#f3e8de] text-brand-navy"
                    : "border border-[#eadccf] bg-white text-brand-steel"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
