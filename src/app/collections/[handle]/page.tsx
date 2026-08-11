import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCollections,
  getCollection,
  getCollectionProducts,
} from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export function generateStaticParams() {
  return getAllCollections().map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollection(handle);
  return { title: collection ? `${collection.title} | Tottoms` : "Tottoms" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const products = getCollectionProducts(handle);

  return (
    <div className="page-width py-14">
      <div className="max-w-2xl mb-10">
        <h1 className="text-3xl font-semibold">{collection.title}</h1>
        {collection.descriptionHtml && (
          <div
            className="mt-3 text-sm text-muted [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
          />
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted">No products in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
