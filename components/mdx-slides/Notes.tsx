/**
 * Notes component — used in MDX slides for speaker notes.
 * Content is extracted from raw MDX before compilation,
 * so this component is a no-op fallback if it somehow renders.
 */
interface NotesProps {
  children: React.ReactNode;
}

export function Notes({ children }: NotesProps) {
  return (
    <div data-slide-notes style={{ display: "none" }}>
      {children}
    </div>
  );
}
