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
    { name: "admin", path: "/admin/", h1: false },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const results = [];

for (const { name, path: pagePath, h1 = true } of pages) {
    const url = `${baseUrl}${pagePath}`;
    const response = await page.goto(url, { waitUntil: "load", timeout: 60000 });
    const isAdmin = name === "admin";

    if (isAdmin) {
        await page.waitForSelector("#nc-root", { timeout: 60000 });
    } else {
        await page.waitForSelector("nav.bg-gray-700", { timeout: 15000 });
        if (h1) {
            await page.waitForSelector("h1", { timeout: 15000 });
        }
    }

    const title = await page.title();
    const hasNav = isAdmin
        ? true
        : (await page.locator("nav.bg-gray-700").count()) > 0;
    const hasH1 = !h1 || (await page.locator("h1").count()) > 0;

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

const failed = results.filter((r) => {
    if (r.status !== 200 || !r.title) return true;
    if (r.name === "admin") return false;
    return !r.hasNav || !r.hasH1;
});

if (failed.length) {
    process.exit(1);
}
