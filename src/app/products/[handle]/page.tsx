import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProduct } from "@/lib/data";
import { ProductDetail } from "@/components/product-detail";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  return { title: product ? `${product.title} | Tottoms` : "Tottoms" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
