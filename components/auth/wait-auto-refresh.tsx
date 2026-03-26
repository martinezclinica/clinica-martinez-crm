"use client";

import { startTransition, useEffect, useEffectEvent } from "react";
import { useRouter } from "next/navigation";

type WaitAutoRefreshProps = {
  intervalMs?: number;
};

export function WaitAutoRefresh({
  intervalMs = 5000,
}: WaitAutoRefreshProps) {
  const router = useRouter();

  const refreshPage = useEffectEvent(() => {
    startTransition(() => {
      router.refresh();
    });
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refreshPage();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [intervalMs]);

  return (
    <p className="mt-6 text-center text-sm text-brand-steel">
      Revisando aprobacion automaticamente...
    </p>
  );
}
