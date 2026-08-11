import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPages, getPage } from "@/lib/data";

// "inventory" and "contact" have dedicated hand-built routes
// (src/app/pages/inventory, src/app/pages/contact) that take precedence.
const OVERRIDDEN_HANDLES = new Set(["inventory", "contact"]);

export function generateStaticParams() {
  return getAllPages()
    .filter((p) => !OVERRIDDEN_HANDLES.has(p.handle))
    .map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const page = getPage(handle);
  return { title: page ? `${page.title} | Tottoms` : "Tottoms" };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const page = getPage(handle);
  if (!page) notFound();

  return (
    <div className="page-width py-14 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">{page.title}</h1>
      <div
        className="text-sm leading-relaxed text-foreground/90 flex flex-col gap-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:leading-relaxed [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_img]:rounded-lg [&_img]:my-4"
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
    </div>
  );
}
