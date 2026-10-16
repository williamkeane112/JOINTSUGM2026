import { Sparkles } from "lucide-react";
import { BRAND_NAME } from "../../lib/brand";

/** Gradient tile + wordmark, same mark as the Auth story panel. */
export default function BrandMark({ hideNameOnMobile = false }: { hideNameOnMobile?: boolean }) {
  return (
    <span className="font-display flex items-center gap-2.5 text-base font-extrabold tracking-[-0.01em]!">
      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-[#ff9ab8] to-[#ff3f7e] shadow-[0_8px_20px_rgba(255,79,135,0.4)]">
        <Sparkles aria-hidden="true" className="size-4 fill-[#fff8df] text-[#fff8df]" />
      </span>
      <span className={hideNameOnMobile ? "hidden sm:inline" : undefined}>{BRAND_NAME}</span>
    </span>
  );
}
