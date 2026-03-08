import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getAllPresentationSlugs,
  getPresentationBySlug,
} from "@/lib/presentations";
import { PresentationViewer } from "@/components/PresentationViewer";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPresentationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pres = getPresentationBySlug(slug);
  if (!pres) return {};

  return {
    title: `${pres.title} | ${pres.event}`,
    description: pres.description,
  };
}

export default async function PresentationPage({ params }: PageProps) {
  const { slug } = await params;
  const pres = getPresentationBySlug(slug);

  if (!pres) {
    notFound();
  }

  return (
    <Suspense>
      <PresentationViewer slides={pres.slides} slug={slug} />
    </Suspense>
  );
}
