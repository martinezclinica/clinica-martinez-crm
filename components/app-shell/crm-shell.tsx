import Link from "next/link";
import type { ReactNode } from "react";

import { CrmSidebar } from "@/components/app-shell/sidebar";
import { requireApprovedUser } from "@/lib/auth/session";

const dateFilters = [
  { value: "today", label: "Hoy" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
] as const;

export type DateFilterValue = (typeof dateFilters)[number]["value"];

type CrmShellProps = {
  activePath: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  activeDateFilter?: DateFilterValue;
  headerContent?: ReactNode;
  dateFilterQuery?: Record<string, string | number | undefined>;
};

export async function CrmShell({
  activePath,
  eyebrow,
  title,
  description,
  children,
  activeDateFilter = "today",
  headerContent,
  dateFilterQuery,
}: CrmShellProps) {
  const { user, profile } = await requireApprovedUser();

  return (
    <div className="min-h-screen bg-[#f8f5f1] text-brand-navy lg:grid lg:h-screen lg:grid-cols-[208px_1fr] lg:overflow-hidden">
      <CrmSidebar
        activePath={activePath}
        email={user.email ?? ""}
        name={profile.full_name ?? user.email ?? "Usuario"}
        role={profile.role}
      />

      <div className="min-h-screen lg:h-screen lg:overflow-y-auto">
        <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6 xl:px-8">
          <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-brand-steel/52">
                {eyebrow}
              </p>
              <h1 className="font-heading mt-2 text-[2.35rem] font-bold tracking-[-0.045em] text-brand-navy sm:text-[2.8rem] xl:text-[3.15rem]">
                {title}
              </h1>
              {description ? (
                <p className="mt-2.5 max-w-2xl text-[0.96rem] leading-7 text-brand-steel sm:text-base">
                  {description}
                </p>
              ) : null}
              {headerContent ? <div className="mt-4">{headerContent}</div> : null}
            </div>

            <div className="rounded-[0.95rem] border border-[#e6dbcf] bg-white p-1 shadow-[0_4px_14px_rgba(22,36,61,0.03)]">
              <div className="flex items-center gap-1">
                {dateFilters.map((filter) => {
                  const isActive = filter.value === activeDateFilter;
                  const params = new URLSearchParams();
                  params.set("range", filter.value);

                  if (dateFilterQuery) {
                    for (const [key, value] of Object.entries(dateFilterQuery)) {
                      if (value !== undefined && value !== "") {
                        params.set(key, String(value));
                      }
                    }
                  }

                  return (
                    <Link
                      key={filter.value}
                      href={`${activePath}?${params.toString()}`}
                      className={`inline-flex min-w-[4.7rem] items-center justify-center rounded-[0.7rem] px-3 py-2 text-[0.82rem] font-semibold transition ${
                        isActive
                          ? "bg-[#f3e8de] text-brand-navy"
                          : "text-brand-steel hover:bg-[#faf1e9] hover:text-brand-navy"
                      }`}
                    >
                      {filter.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-6 pb-8">{children}</section>
        </main>
      </div>
    </div>
  );
}
