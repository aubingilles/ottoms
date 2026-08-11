import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPolicies, getPolicy } from "@/lib/data";

export function generateStaticParams() {
  return getAllPolicies().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const page = getPolicy(handle);
  return { title: page ? `${page.title} | Tottoms` : "Tottoms" };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const page = getPolicy(handle);
  if (!page) notFound();

  return (
    <div className="page-width py-14 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">{page.title}</h1>
      <div
        className="text-sm leading-relaxed text-foreground/90 flex flex-col gap-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_p]:leading-relaxed [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
    </div>
  );
}
