// Screenshot + overflow check for visual review.
// Usage: npm run screenshot -- [/route?query ...]
// Needs the dev server running (npm run dev). Uses the installed Microsoft Edge (no browser download).
// Env: BASE_URL (default http://localhost:5173), BROWSER_CHANNEL (default msedge; e.g. chrome).
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

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel });
let overflowFound = false;

try {
  for (const route of routes) {
    for (const { name, width, height } of viewports) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500); // let count-up animations finish

      const file = `${outDir}/${slug(route)}-${name}.png`;
      await page.screenshot({ path: file, fullPage: true });

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      const overflow = scrollWidth > clientWidth;
      overflowFound ||= overflow;
      console.log(`${overflow ? "OVERFLOW" : "ok      "} ${name} ${width}px ${route} -> ${file} (scrollWidth ${scrollWidth} / clientWidth ${clientWidth})`);

      await context.close();
    }
  }
} finally {
  await browser.close();
}

process.exit(overflowFound ? 1 : 0);
