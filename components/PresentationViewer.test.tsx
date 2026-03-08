import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PresentationViewer } from "./PresentationViewer";
import type { Slide } from "@/lib/presentations";

const mockSlides: Slide[] = [
  {
    type: "title",
    title: "Test Presentation",
    subtitle: "A subtitle",
    notes: "Speaker note for slide 1",
  },
  {
    type: "bullets",
    title: "Bullet Points",
    items: ["Item one", "Item two"],
    notes: "Speaker note for slide 2",
  },
  {
    type: "code",
    title: "Code Example",
    language: "typescript",
    code: "const x = 1;",
  },
];

let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("PresentationViewer", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
  });

  it("renders the first slide by default", () => {
    render(<PresentationViewer slides={mockSlides} slug="test" />);
    expect(screen.getByText("Test Presentation")).toBeInTheDocument();
  });

  it("shows slide counter", () => {
    render(<PresentationViewer slides={mockSlides} slug="test" />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("navigates to next slide on button click", async () => {
    const user = userEvent.setup();
    render(<PresentationViewer slides={mockSlides} slug="test" />);

    await user.click(screen.getByRole("button", { name: /next slide/i }));
    expect(screen.getByText("Bullet Points")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("navigates with arrow keys", async () => {
    const user = userEvent.setup();
    render(<PresentationViewer slides={mockSlides} slug="test" />);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Bullet Points")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Test Presentation")).toBeInTheDocument();
  });

  it("disables previous button on first slide", () => {
    render(<PresentationViewer slides={mockSlides} slug="test" />);
    const prevBtn = screen.getByRole("button", { name: /previous slide/i });
    expect(prevBtn).toBeDisabled();
  });

  it("toggles speaker notes with N key", async () => {
    const user = userEvent.setup();
    render(<PresentationViewer slides={mockSlides} slug="test" />);

    expect(
      screen.queryByText("Speaker note for slide 1")
    ).not.toBeInTheDocument();

    await user.keyboard("n");
    expect(
      screen.getByText("Speaker note for slide 1")
    ).toBeInTheDocument();

    await user.keyboard("n");
    expect(
      screen.queryByText("Speaker note for slide 1")
    ).not.toBeInTheDocument();
  });

  it("toggles speaker notes with button click", async () => {
    const user = userEvent.setup();
    render(<PresentationViewer slides={mockSlides} slug="test" />);

    await user.click(
      screen.getByRole("button", { name: /show speaker notes/i })
    );
    expect(
      screen.getByText("Speaker note for slide 1")
    ).toBeInTheDocument();
  });

  it("shows progress bar", () => {
    render(<PresentationViewer slides={mockSlides} slug="test" />);
    expect(
      screen.getByRole("progressbar", { name: /slide progress/i })
    ).toBeInTheDocument();
  });

  it("starts on deep-linked slide", () => {
    mockSearchParams = new URLSearchParams("slide=2");
    render(<PresentationViewer slides={mockSlides} slug="test" />);
    expect(screen.getByText("Bullet Points")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("navigates to first/last slide with Home/End", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams("slide=2");
    render(<PresentationViewer slides={mockSlides} slug="test" />);

    await user.keyboard("{End}");
    expect(screen.getByText("3 / 3")).toBeInTheDocument();

    await user.keyboard("{Home}");
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });
});
