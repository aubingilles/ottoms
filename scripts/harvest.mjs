#!/usr/bin/env node
/**
 * One-time (rerunnable) content harvester.
 *
 * Pulls real product/collection/page content from the live tottoms.com
 * Shopify store's public JSON endpoints + rendered HTML, and writes it
 * into src/data/*.json so the Next.js site owns its own copy of the text
 * content. Image/video URLs are kept as absolute tottoms.com/cdn.shopify.com
 * links (hotlinked, never downloaded) per project requirements.
 *
 * Usage: node scripts/harvest.mjs
 */
import { load } from "cheerio";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "https://tottoms.com";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";
const DATA_DIR = path.join(process.cwd(), "src", "data");

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function getSitemapLocs(kind) {
  const index = load(await fetchText(`${BASE}/sitemap.xml`), { xmlMode: true });
  const subSitemaps = index("sitemap > loc")
    .map((_, el) => index(el).text())
    .get()
    .filter((u) => u.includes(`sitemap_${kind}_`));

  const locs = [];
  for (const url of subSitemaps) {
    const $ = load(await fetchText(url), { xmlMode: true });
    $("url > loc").each((_, el) => locs.push($(el).text()));
  }
  return locs;
}

function handleFromUrl(url) {
  return url.split("/").filter(Boolean).pop();
}

async function harvestProducts() {
  const urls = await getSitemapLocs("products");
  console.log(`Found ${urls.length} products`);
  const products = {};
  for (const url of urls) {
    const handle = handleFromUrl(url);
    try {
      const { product: p } = await fetchJson(`${BASE}/products/${handle}.json`);
      products[handle] = {
        id: p.id,
        handle: p.handle,
        title: p.title,
        vendor: p.vendor,
        productType: p.product_type,
        tags: p.tags,
        descriptionHtml: p.body_html ?? "",
        options: p.options.map((o) => ({ name: o.name, values: o.values })),
        images: p.images.map((img) => ({
          src: img.src,
          alt: img.alt ?? p.title,
          width: img.width,
          height: img.height,
        })),
        variants: p.variants.map((v) => ({
          id: v.id,
          title: v.title,
          price: v.price,
          compareAtPrice: v.compare_at_price || null,
          option1: v.option1,
          option2: v.option2,
          option3: v.option3,
          sku: v.sku,
        })),
      };
      process.stdout.write(".");
    } catch (err) {
      console.warn(`\nFailed product ${handle}: ${err.message}`);
    }
  }
  console.log(`\nHarvested ${Object.keys(products).length} products`);
  return products;
}

async function harvestCollections() {
  const urls = await getSitemapLocs("collections");
  console.log(`Found ${urls.length} collections`);
  const collections = {};
  for (const url of urls) {
    const handle = handleFromUrl(url);
    try {
      const { collection: c } = await fetchJson(`${BASE}/collections/${handle}.json`);
      const { products } = await fetchJson(
        `${BASE}/collections/${handle}/products.json?limit=250`
      );
      collections[handle] = {
        id: c.id,
        handle: c.handle,
        title: c.title,
        descriptionHtml: c.description ?? "",
        image: c.image?.src ?? null,
        productHandles: products.map((p) => p.handle),
      };
      process.stdout.write(".");
    } catch (err) {
      console.warn(`\nFailed collection ${handle}: ${err.message}`);
    }
  }
  console.log(`\nHarvested ${Object.keys(collections).length} collections`);
  return collections;
}

// Strip Shopify theme cruft (inline <style>/<script>, section wrapper divs,
// data-* / shopify-section attributes) while keeping real content markup and
// hotlinked image/link URLs intact.
function sanitizePageHtml($, root) {
  root.find("style, script, noscript, template").remove();
  root.find("*").each((_, el) => {
    const attribs = el.attribs || {};
    for (const name of Object.keys(attribs)) {
      if (
        name.startsWith("data-") ||
        name === "id" ||
        name.startsWith("on") ||
        name === "style"
      ) {
        $(el).removeAttr(name);
      }
    }
  });
  root.find("[class]").each((_, el) => {
    const cls = ($(el).attr("class") || "")
      .split(/\s+/)
      .filter((c) => /^(h[1-6]|p|ul|ol|li|a|strong|em|b|i|blockquote|table|thead|tbody|tr|td|th|img|figure|figcaption)$/i.test(c) === false)
      .filter((c) => !c.startsWith("shopify-") && c !== "isSelectedEnd");
    if (cls.length) $(el).attr("class", cls.join(" "));
    else $(el).removeAttr("class");
  });
  return root.html() ?? "";
}

async function harvestPages() {
  const urls = await getSitemapLocs("pages");
  console.log(`Found ${urls.length} pages`);
  const pages = {};
  for (const url of urls) {
    const handle = handleFromUrl(url);
    try {
      const html = await fetchText(url);
      const $ = load(html);
      const title =
        $("h1").first().text().trim() ||
        $("title").text().replace(/\s*[–—-]\s*Tottoms.*$/i, "").trim();
      const main = $("main#MainContent, main.main-content, main").first();
      const bodyHtml = sanitizePageHtml($, main);
      pages[handle] = { handle, title, bodyHtml };
      process.stdout.write(".");
    } catch (err) {
      console.warn(`\nFailed page ${handle}: ${err.message}`);
    }
  }
  console.log(`\nHarvested ${Object.keys(pages).length} pages`);
  return pages;
}

const POLICY_HANDLES = [
  "privacy-policy",
  "refund-policy",
  "terms-of-service",
  "contact-information",
];

async function harvestPolicies() {
  const policies = {};
  for (const handle of POLICY_HANDLES) {
    try {
      const html = await fetchText(`${BASE}/policies/${handle}`);
      const $ = load(html);
      const title =
        $("h1").first().text().trim() ||
        $("title").text().replace(/\s*[–—-]\s*Tottoms.*$/i, "").trim();
      const main = $("main#MainContent, main.main-content, main").first();
      const bodyHtml = sanitizePageHtml($, main);
      policies[handle] = { handle, title, bodyHtml };
      process.stdout.write(".");
    } catch (err) {
      console.warn(`\nFailed policy ${handle}: ${err.message}`);
    }
  }
  console.log(`\nHarvested ${Object.keys(policies).length} policies`);
  return policies;
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });

  const [products, collections, pages, policies] = await Promise.all([
    harvestProducts(),
    harvestCollections(),
    harvestPages(),
    harvestPolicies(),
  ]);

  await writeFile(
    path.join(DATA_DIR, "products.json"),
    JSON.stringify(products, null, 2)
  );
  await writeFile(
    path.join(DATA_DIR, "collections.json"),
    JSON.stringify(collections, null, 2)
  );
  await writeFile(path.join(DATA_DIR, "pages.json"), JSON.stringify(pages, null, 2));
  await writeFile(
    path.join(DATA_DIR, "policies.json"),
    JSON.stringify(policies, null, 2)
  );

  console.log("\nDone. Wrote src/data/{products,collections,pages,policies}.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
