import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllPresentationSlugs,
  getPresentationBySlug,
} from "@/lib/presentations";
import { PresentationViewer } from "@/components/PresentationViewer";
import type { Metadata } from "next";
import styles from "./page.module.css";

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

  const hasPhotos = pres.photos && pres.photos.length > 0;

  return (
    <div className={styles.page}>
      {hasPhotos && (
        <div className={styles.gallery}>
          <div className={styles.galleryHeader}>
            <span className={styles.galleryLabel}>EVENT PHOTOS</span>
            <span className={styles.galleryMeta}>
              {pres.event} &mdash; {pres.date}
            </span>
          </div>
          <div className={styles.galleryGrid}>
            {pres.photos!.map((photo, i) => (
              <div key={photo} className={styles.galleryItem}>
                <Image
                  src={photo}
                  alt={`${pres.event} — photo ${i + 1}`}
                  width={400}
                  height={200}
                  className={styles.galleryPhoto}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Suspense>
        <PresentationViewer slides={pres.slides} slug={slug} />
      </Suspense>
    </div>
  );
}
