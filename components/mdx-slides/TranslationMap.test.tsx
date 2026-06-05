import { render, screen } from "@testing-library/react";
import { TranslationMap } from "./TranslationMap";

describe("TranslationMap", () => {
  it("at v1 renders the sparse 2-row table (person + address) with the v0.1 subtitle", () => {
    render(<TranslationMap version="1" />);
    // Component title was dropped — the slide H2 in MDX carries the title
    // and the component now only shows the orientation subtitle.
    expect(
      screen.getByText("What each context calls the same concept"),
    ).toBeInTheDocument();
    expect(screen.getByText("The person")).toBeInTheDocument();
    expect(screen.getByText("The address")).toBeInTheDocument();
    // Rows that only appear at v0.2+ are not present yet
    expect(screen.queryByText("The delivery")).not.toBeInTheDocument();
    expect(screen.queryByText("The reservation")).not.toBeInTheDocument();
  });

  it("at v1 marks Consignee as the system of record for the person", () => {
    render(<TranslationMap version="1" />);
    // Inline field counts surface the 20-vs-3 system-of-record signal.
    expect(screen.getByText("customer (20)")).toBeInTheDocument();
    expect(screen.getByText("buyer (3)")).toBeInTheDocument();
    expect(screen.getAllByText(/✅/).length).toBeGreaterThanOrEqual(1);
  });

  it("at v1 surfaces the same-name-different-concept finding for Tracking + Inventory", () => {
    render(<TranslationMap version="1" />);
    // Both Inventory and Tracking call the person 'user', with different
    // field counts — same name, different concept.
    expect(screen.getByText("user (1)")).toBeInTheDocument();
    expect(screen.getByText("user (2)")).toBeInTheDocument();
    expect(screen.getByText("Tracking")).toBeInTheDocument();
  });

  it("at v2 adds delivery / bill / reservation / return rows + the business rules box", () => {
    render(<TranslationMap version="2" />);
    expect(
      screen.getByText("Now with business rules nobody documented"),
    ).toBeInTheDocument();
    expect(screen.getByText("The delivery")).toBeInTheDocument();
    expect(screen.getByText("The bill")).toBeInTheDocument();
    expect(screen.getByText("The reservation")).toBeInTheDocument();
    expect(screen.getByText("The return")).toBeInTheDocument();
    expect(
      screen.getByText(/Rules found in error codes/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Price variance tolerance/i)).toBeInTheDocument();
  });

  it("at v3 keeps the rules box and adds the three summary cards", () => {
    render(<TranslationMap version="3" />);
    // Rules box stays on the Rosetta Stone — visually reinforces
    // "we found a lot" alongside the summary cards.
    expect(
      screen.getByText(/Rules found in error codes/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Same concepts\. Different names\. No translation map existed/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("The payment")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText(/names for one person/i)).toBeInTheDocument();
    expect(screen.getByText(/rules never written down/i)).toBeInTheDocument();
    expect(screen.getByText(/events never published/i)).toBeInTheDocument();
  });

  it("at v3 the return row shows the delegation to Returns / Policy", () => {
    render(<TranslationMap version="3" />);
    expect(screen.getByText("→ Returns / Policy")).toBeInTheDocument();
  });
});
