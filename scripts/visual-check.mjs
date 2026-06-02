import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8000";
const outDir = path.resolve("tmp/visual-check");

const pages = [
    { name: "home", path: "/" },
    { name: "getting-started", path: "/getting-started/" },
    { name: "contacts", path: "/contacts/" },
    { name: "releases", path: "/releases/" },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const results = [];

for (const { name, path: pagePath } of pages) {
    const url = `${baseUrl}${pagePath}`;
    const response = await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.waitForSelector("nav.bg-gray-700", { timeout: 15000 });
    await page.waitForSelector("h1", { timeout: 15000 });

    const title = await page.title();
    const hasNav = (await page.locator("nav.bg-gray-700").count()) > 0;
    const hasH1 = (await page.locator("h1").count()) > 0;

    await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });

    results.push({
        name,
        url,
        status: response?.status(),
        title,
        hasNav,
        hasH1,
    });
}

await browser.close();

console.log(JSON.stringify(results, null, 2));

const failed = results.filter(
    (r) => r.status !== 200 || !r.hasNav || !r.hasH1 || !r.title
);

if (failed.length) {
    process.exit(1);
}
