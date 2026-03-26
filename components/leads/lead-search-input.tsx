"use client";

import { useDeferredValue, useEffect, useEffectEvent, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

type LeadSearchInputProps = {
  initialQuery: string;
  activeRange: string;
};

export function LeadSearchInput({
  initialQuery,
  activeRange,
}: LeadSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialQuery);
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  const navigateToSearch = (nextQuery: string) => {
    const params = new URLSearchParams();
    params.set("range", activeRange);
    params.set("page", "1");

    if (nextQuery) {
      params.set("q", nextQuery);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const updateSearch = useEffectEvent((nextQuery: string) => {
    navigateToSearch(nextQuery);
  });

  useEffect(() => {
    const normalized = deferredValue.trim();

    if (normalized === initialQuery) {
      return;
    }

    if (normalized.length > 0 && normalized.length < 3) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateSearch(normalized);
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [deferredValue, initialQuery]);

  const handleClear = () => {
    setValue("");
    navigateToSearch("");
  };

  return (
    <div className="w-full max-w-[30rem]">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Buscar por nombre, correo o numero"
          className="w-full rounded-lg border border-[#e5ddd3] bg-white px-3 py-2 text-[0.84rem] text-brand-navy outline-none transition placeholder:text-brand-steel/55 focus:border-brand-navy"
        />
        {value.trim() ? (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-[0.8rem] font-semibold text-brand-steel transition hover:underline hover:underline-offset-4"
          >
            Limpiar
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-[0.72rem] text-brand-steel/70">
        La busqueda se activa desde 3 caracteres.
      </p>
    </div>
  );
}
