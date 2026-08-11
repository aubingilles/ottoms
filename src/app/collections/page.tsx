import Link from "next/link";
import type { Metadata } from "next";
import { getAllCollections } from "@/lib/data";

export const metadata: Metadata = { title: "Parts | Tottoms" };

export default function CollectionsIndexPage() {
  const collections = getAllCollections();

  return (
    <div className="page-width py-14">
      <h1 className="text-3xl font-semibold mb-10">Shop by Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className="group flex flex-col gap-3"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-solid border border-border">
              {collection.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={collection.image}
                  alt={collection.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <h2 className="text-sm font-medium">{collection.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
