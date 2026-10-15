import { Link } from "react-router-dom";
import BrandMark from "./BrandMark";
import { CONTAINER } from "./landingStyles";

const footerLink =
  "inline-flex min-h-9 items-center rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] pointer-coarse:min-h-11";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--color-line)]">
      <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4 py-6`}>
        <div className="flex items-center gap-4">
          <BrandMark />
          <span className="text-sm text-[var(--color-muted)]">© 2026</span>
        </div>
        <nav aria-label="Tautan bawah" className="flex items-center gap-6">
          <Link to="/auth" className={footerLink}>
            Masuk
          </Link>
          <a
            href="https://github.com/williamkeane112/JOINTSUGM2026"
            target="_blank"
            rel="noreferrer"
            className={footerLink}
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
