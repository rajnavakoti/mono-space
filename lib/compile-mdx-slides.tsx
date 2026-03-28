import type { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxSlideComponents } from "@/components/mdx-slides";
import type { MdxPresentationRaw } from "./presentations";

export interface CompiledMdxSlide {
  content: ReactNode;
  notes?: string;
}

/**
 * Extract <Notes>...</Notes> content from raw MDX source.
 * Returns the cleaned source (without Notes) and the notes text.
 */
export function extractNotes(mdxSource: string): {
  source: string;
  notes?: string;
} {
  const notesRegex = /<Notes>([\s\S]*?)<\/Notes>/;
  const match = mdxSource.match(notesRegex);

  if (!match) {
    return { source: mdxSource };
  }

  return {
    source: mdxSource.replace(notesRegex, "").trim(),
    notes: match[1].trim(),
  };
}

/**
 * Compile all slides in an MDX presentation.
 * Each slide chunk is compiled independently with shared components.
 */
export async function compileMdxSlides(
  raw: MdxPresentationRaw
): Promise<CompiledMdxSlide[]> {
  const compiled = await Promise.all(
    raw.slideContents.map(async (slideSource) => {
      const { source, notes } = extractNotes(slideSource);

      const { content } = await compileMDX({
        source,
        components: mdxSlideComponents,
        options: { parseFrontmatter: false },
      });

      return { content, notes };
    })
  );

  return compiled;
}
