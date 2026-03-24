import Image from "next/image";

type BrandLockupProps = {
  align?: "center" | "left";
};

export function BrandLockup({ align = "center" }: BrandLockupProps) {
  const alignmentClass =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`flex flex-col gap-2 ${alignmentClass}`}>
      <Image
        src="/logo-omni-agencia.png"
        alt="Omni Agencia"
        width={align === "left" ? 220 : 210}
        height={72}
        priority
      />
      <div className={alignmentClass}>
        <p className="text-[0.98rem] font-light uppercase tracking-[0.28em] text-brand-navy/95">
          Clinica Martinez
        </p>
      </div>
    </div>
  );
}
