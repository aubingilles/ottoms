import productsJson from "@/data/products.json";
import collectionsJson from "@/data/collections.json";
import pagesJson from "@/data/pages.json";
import policiesJson from "@/data/policies.json";
import type { Collection, ContentPage, Product } from "@/lib/types";

const products = productsJson as Record<string, Product>;
const collections = collectionsJson as Record<string, Collection>;
const pages = pagesJson as Record<string, ContentPage>;
const policies = policiesJson as Record<string, ContentPage>;

export function getAllProducts(): Product[] {
  return Object.values(products);
}

export function getProduct(handle: string): Product | undefined {
  return products[handle];
}

export function getAllCollections(): Collection[] {
  return Object.values(collections);
}

export function getCollection(handle: string): Collection | undefined {
  return collections[handle];
}

export function getCollectionProducts(handle: string): Product[] {
  const collection = collections[handle];
  if (!collection) return [];
  return collection.productHandles
    .map((h) => products[h])
    .filter((p): p is Product => Boolean(p));
}

export function getAllPages(): ContentPage[] {
  return Object.values(pages);
}

export function getPage(handle: string): ContentPage | undefined {
  return pages[handle];
}

export function getAllPolicies(): ContentPage[] {
  return Object.values(policies);
}

export function getPolicy(handle: string): ContentPage | undefined {
  return policies[handle];
}

export const NAV_LINKS = [
  { label: "Karts", href: "/pages/inventory" },
  { label: "Upgrade Kits", href: "/collections/kits" },
  { label: "Parts", href: "/collections" },
  { label: "Support", href: "/pages/contact" },
] as const;

export const FOOTER_POLICY_LINKS = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
  { label: "Contact Information", href: "/policies/contact-information" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/drifttottoms" },
  { label: "TikTok", href: "https://tiktok.com/tottoms" },
  { label: "YouTube", href: "https://www.youtube.com/@drifttottoms" },
] as const;
