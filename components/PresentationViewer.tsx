"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Slide } from "@/lib/presentations";
import { SlideRenderer } from "./SlideRenderer";
import styles from "./PresentationViewer.module.css";

interface PresentationViewerProps {
  slides: Slide[];
  slug: string;
}

export function PresentationViewer({ slides, slug }: PresentationViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const initialSlide = Number(searchParams.get("slide")) || 1;
  const [currentSlide, setCurrentSlide] = useState(
    Math.min(Math.max(1, initialSlide), slides.length)
  );
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = slides.length;
  const slide = slides[currentSlide - 1];
  const progress = (currentSlide / totalSlides) * 100;

  const goToSlide = useCallback(
    (n: number) => {
      const clamped = Math.min(Math.max(1, n), totalSlides);
      setCurrentSlide(clamped);
      const url = `/presentations/${slug}?slide=${clamped}`;
      router.replace(url, { scroll: false });
    },
    [totalSlides, slug, router]
  );

  const next = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);
  const first = useCallback(() => goToSlide(1), [goToSlide]);
  const last = useCallback(() => goToSlide(totalSlides), [goToSlide, totalSlides]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          first();
          break;
        case "End":
          e.preventDefault();
          last();
          break;
        case "f":
        case "Enter":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
          break;
        case "n":
        case "N":
          e.preventDefault();
          setShowNotes((prev) => !prev);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, first, last, toggleFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Touch/swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      const minSwipe = 50;

      // Only horizontal swipes (ignore vertical scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipe) {
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
    },
    [next, prev]
  );

  const notes = "notes" in slide ? slide.notes : undefined;

  return (
    <div
      ref={containerRef}
      className={`${styles.viewer} ${isFullscreen ? styles.fullscreen : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.slideContainer}>
        <SlideRenderer slide={slide} />
      </div>

      {/* Speaker Notes */}
      {showNotes && notes && (
        <div className={styles.notesPanel} aria-label="Speaker notes">
          <h3 className={styles.notesTitle}>// notes</h3>
          <p className={styles.notesText}>{notes}</p>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.navButton}
          onClick={prev}
          disabled={currentSlide === 1}
          aria-label="Previous slide"
        >
          &larr;
        </button>

        <span className={styles.counter} aria-live="polite">
          {currentSlide} / {totalSlides}
        </span>

        <button
          className={styles.navButton}
          onClick={next}
          disabled={currentSlide === totalSlides}
          aria-label="Next slide"
        >
          &rarr;
        </button>

        <button
          className={styles.controlButton}
          onClick={() => setShowNotes(!showNotes)}
          aria-label={showNotes ? "Hide speaker notes" : "Show speaker notes"}
          aria-pressed={showNotes}
        >
          [N]
        </button>

        <button
          className={styles.controlButton}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? "[X]" : "[F]"}
        </button>
      </div>

      {/* Progress Bar */}
      <div
        className={styles.progressBar}
        role="progressbar"
        aria-valuenow={currentSlide}
        aria-valuemin={1}
        aria-valuemax={totalSlides}
        aria-label="Slide progress"
      >
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
