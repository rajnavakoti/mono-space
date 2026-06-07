import { render, screen } from "@testing-library/react";
import { ContradictionReveal } from "./ContradictionReveal";

describe("ContradictionReveal", () => {
  it("renders earlier + later sections with their statements", () => {
    render(
      <ContradictionReveal
        earlierExhibit="Exhibit A"
        earlierClaim="clean boundary|references nobody"
        laterExhibit="Exhibit B"
        laterFinding="bypassed by 3 services|facade"
      />,
    );

    expect(screen.getByText(/exhibit a said/i)).toBeInTheDocument();
    expect(screen.getByText("clean boundary")).toBeInTheDocument();
    expect(screen.getByText("references nobody")).toBeInTheDocument();
    expect(screen.getByText(/exhibit b reveals/i)).toBeInTheDocument();
    expect(screen.getByText("bypassed by 3 services")).toBeInTheDocument();
    expect(screen.getByText("facade")).toBeInTheDocument();
  });

  it("renders the integrated punchline footer when provided", () => {
    render(
      <ContradictionReveal
        earlierExhibit="Exhibit A"
        earlierClaim="a"
        laterExhibit="Exhibit B"
        laterFinding="b"
        punchline="Contracts declared a boundary. The database showed it doesn't exist."
      />,
    );

    expect(screen.getByText(/Contracts declared a boundary/)).toBeInTheDocument();
  });

  it("uses a custom connector label when provided", () => {
    render(
      <ContradictionReveal
        earlierExhibit="Exhibit A"
        earlierClaim="a"
        laterExhibit="Exhibit B"
        laterFinding="b"
        connector="but the database says…"
      />,
    );

    expect(screen.getByText(/but the database says/i)).toBeInTheDocument();
  });
});
