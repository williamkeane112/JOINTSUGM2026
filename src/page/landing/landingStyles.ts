/** Shared layout and type classes for the landing page sections. */
export const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

/**
 * From lg up each section fills at least one screen with its content centered, so a jump link
 * lands on exactly one section. min-height, never a fixed height: taller content still grows.
 * Below lg content is taller than the screen anyway, so sections keep natural height.
 */
export const SECTION = "scroll-mt-0 py-16 sm:py-24 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-16";

export const SECTION_TITLE =
  "font-display text-2xl leading-tight font-bold tracking-[-0.025em]! text-balance sm:text-[32px]";

export const SECTION_LEAD = "mt-3 max-w-[56ch] text-base leading-relaxed text-[var(--color-muted)]";

/** The single dark surface of the page (hero), continuing the Auth story panel. */
export const NIGHT_GRADIENT = "linear-gradient(135deg, #280b39 0%, #170821 55%, #210828 100%)";
