import { render, screen } from "@testing-library/react";
import { LineageTree } from "./LineageTree";

describe("LineageTree", () => {
  it("renders branch cards with label, tagline, details, context", () => {
    render(
      <LineageTree branches="SHIPMENT::📸::Snapshot::ORDER::Frozen at order time·Never refreshed" />,
    );

    expect(screen.getByText("SHIPMENT")).toBeInTheDocument();
    expect(screen.getByText("📸")).toBeInTheDocument();
    expect(screen.getByText("Snapshot")).toBeInTheDocument();
    expect(screen.getByText("ORDER")).toBeInTheDocument();
    expect(screen.getByText(/Frozen at order time/)).toBeInTheDocument();
    expect(screen.getByText(/Never refreshed/)).toBeInTheDocument();
  });

  it("renders the source card when source prop is provided", () => {
    render(
      <LineageTree
        source="CONSIGNEE::source of truth"
        branches="A::📸::tagline::ctx::detail"
      />,
    );

    expect(screen.getByText("CONSIGNEE")).toBeInTheDocument();
    expect(screen.getByText(/source of truth/)).toBeInTheDocument();
  });

  it("omits the source card in card-row mode (no source prop)", () => {
    render(<LineageTree branches="A::🔄::Mutable::CTX::detail" />);
    expect(screen.queryByText("CONSIGNEE")).not.toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders the footer when provided", () => {
    render(
      <LineageTree
        branches="A::📸::t::ctx::d"
        footer="342 mismatches in 90 days"
      />,
    );
    expect(screen.getByText(/342 mismatches in 90 days/i)).toBeInTheDocument();
  });
});
