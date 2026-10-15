// Screenshot + overflow check for visual review.
// Usage: npm run screenshot -- [/route?query ...]
// Needs the dev server running (npm run dev). Uses the installed Microsoft Edge (no browser download).
// Env: BASE_URL (default http://localhost:5173), BROWSER_CHANNEL (default msedge; e.g. chrome), TOUCH=1 (emulate touch, check 44px tap targets).
// Also prints per-viewport metrics: page height, visible text under 12px, heading letter-spacing. Exit code 1 on overflow, small text, or small tap targets.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const baseUrl = process.env.BASE_URL ?? "http://localhost:5173";
const channel = process.env.BROWSER_CHANNEL ?? "msedge";
const outDir = ".screenshots";

const defaultRoutes = [
  "/dashboard?demo=budi",
  "/dashboard?demo=sari",
  "/dashboard?demo=empty",
  "/dashboard?demo=done",
];
const routes = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultRoutes;

const viewports = [
  { name: "mobile", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1000 },
  { name: "desktop", width: 1280, height: 800 },
];

const slug = (route) => route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/-+$/, "");

// TOUCH=1 emulates a touch device so `pointer-coarse:` variants apply and tap targets can be measured.
const touch = process.env.TOUCH === "1";

/**
 * Runs in the page. Reports page height, visible text rendered below 12px (HTML and SVG),
 * the computed letter-spacing of the first heading, how far the header nav sits from the viewport center,
 * and (touch only) tap targets under 44px.
 */
function collectMetrics(measureTouch) {
  const isVisible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  };

  const small = [];
  for (const el of document.body.querySelectorAll("*")) {
    const ownText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== "");
    if (!ownText || !isVisible(el)) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 12) small.push(`${el.tagName.toLowerCase()}:${size}px:${el.textContent.trim().slice(0, 24)}`);
  }

  const heading = document.querySelector("main h1, main h2");
  // Measure the pills themselves (first link left edge to last link right edge), not the nav box, which may stretch.
  const navLinks = [...document.querySelectorAll("header nav a")];
  const navOffset = navLinks.length
    ? Math.abs(
        (navLinks[0].getBoundingClientRect().left + navLinks[navLinks.length - 1].getBoundingClientRect().right) / 2 -
          document.documentElement.clientWidth / 2,
      )
    : null;
  const targets = [];
  if (measureTouch) {
    for (const el of document.querySelectorAll("header a, header button, main a, main button")) {
      if (!isVisible(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        targets.push(`${el.tagName.toLowerCase()}:${Math.round(rect.width)}x${Math.round(rect.height)}:${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20)}`);
      }
    }
  }

  return {
    height: document.documentElement.scrollHeight,
    navOffset,
    small,
    tracking: heading ? `${getComputedStyle(heading).letterSpacing}@${getComputedStyle(heading).fontSize}` : "n/a",
    targets: measureTouch ? targets : null,
  };
}

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel });
let overflowFound = false;
let smallFound = false;
let touchFound = false;
let navOffCenter = false;

try {
  for (const route of routes) {
    for (const { name, width, height } of viewports) {
      const context = await browser.newContext({
        viewport: { width, height },
        ...(touch ? { hasTouch: true, isMobile: true } : {}),
      });
      const page = await context.newPage();
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500); // let count-up animations finish

      // Measure before the full-page capture: it resizes the viewport, which can leave CSS transitions mid-flight.
      const metrics = await page.evaluate(collectMetrics, touch);

      const file = `${outDir}/${slug(route)}-${name}.png`;
      await page.screenshot({ path: file, fullPage: true });

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      const overflow = scrollWidth > clientWidth;
      overflowFound ||= overflow;
      console.log(`${overflow ? "OVERFLOW" : "ok      "} ${name} ${width}px ${route} -> ${file} (scrollWidth ${scrollWidth} / clientWidth ${clientWidth})`);

      smallFound ||= metrics.small.length > 0;
      touchFound ||= (metrics.targets?.length ?? 0) > 0;
      navOffCenter ||= metrics.navOffset !== null && metrics.navOffset > 1;
      console.log(
        `metrics  ${name} ${width}px ${route} height=${metrics.height} small=${metrics.small.length} touch=${metrics.targets ? metrics.targets.length : "skip"} navOffset=${metrics.navOffset === null ? "n/a" : `${metrics.navOffset.toFixed(1)}px`} tracking=${metrics.tracking}`,
      );
      if (metrics.small.length > 0) console.log(`         small text: ${metrics.small.join(" | ")}`);
      if (metrics.targets?.length) console.log(`         small targets: ${metrics.targets.join(" | ")}`);

      await context.close();
    }
  }
} finally {
  await browser.close();
}

process.exit(overflowFound || smallFound || touchFound || navOffCenter ? 1 : 0);
