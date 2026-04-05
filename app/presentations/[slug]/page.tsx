import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllPresentationSlugs,
  getPresentationBySlug,
  getMdxPresentationBySlug,
} from "@/lib/presentations";
import { compileMdxSlides } from "@/lib/compile-mdx-slides";
import { SlideRenderer } from "@/components/SlideRenderer";
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

  const mdxPres = getMdxPresentationBySlug(slug);
  if (mdxPres) {
    return {
      title: `${mdxPres.frontmatter.title} | ${mdxPres.frontmatter.event}`,
      description: mdxPres.frontmatter.description,
    };
  }

  const pres = getPresentationBySlug(slug);
  if (pres) {
    return {
      title: `${pres.title} | ${pres.event}`,
      description: pres.description,
    };
  }

  return {};
}

export default async function PresentationPage({ params }: PageProps) {
  const { slug } = await params;

  // Try MDX format first
  const mdxPres = getMdxPresentationBySlug(slug);
  if (mdxPres) {
    const compiled = await compileMdxSlides(mdxPres);
    const slideNodes = compiled.map((slide, i) => (
      <div key={i} className={styles.mdxSlide}>
        {slide.content}
      </div>
    ));
    const notes = compiled.map((slide) => slide.notes);
    const hasPhotos = mdxPres.photos && mdxPres.photos.length > 0;

    return (
      <div className={styles.page}>
        {hasPhotos && (
          <div className={styles.gallery}>
            <div className={styles.galleryHeader}>
              <span className={styles.galleryLabel}>EVENT PHOTOS</span>
              <span className={styles.galleryMeta}>
                {mdxPres.frontmatter.event} &mdash; {mdxPres.frontmatter.date}
              </span>
            </div>
            <div className={styles.galleryGrid}>
              {mdxPres.photos!.map((photo, i) => (
                <div key={photo} className={styles.galleryItem}>
                  <Image
                    src={photo}
                    alt={`${mdxPres.frontmatter.event} — photo ${i + 1}`}
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
          <PresentationViewer slides={slideNodes} notes={notes} slug={slug} />
        </Suspense>
      </div>
    );
  }

  // Fall back to JSON format
  const pres = getPresentationBySlug(slug);
  if (!pres) {
    notFound();
  }

  const slideNodes = pres.slides.map((slide, i) => (
    <SlideRenderer key={i} slide={slide} />
  ));
  const notes = pres.slides.map((slide) =>
    "notes" in slide ? slide.notes : undefined
  );
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
        <PresentationViewer slides={slideNodes} notes={notes} slug={slug} />
      </Suspense>
    </div>
  );
}
