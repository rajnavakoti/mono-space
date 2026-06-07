import { render, screen } from "@testing-library/react";
import { ContractYield } from "./ContractYield";

const fixture = {
  services: [
    { name: "ServiceA", entities: ["EntityX", "EntityY"] },
    { name: "ServiceB", entities: ["EntityZ"] },
  ],
  domainEvents: ["EventOne", "EventTwo", "EventThree"],
};

describe("ContractYield", () => {
  it("renders the entity total and event total", () => {
    render(<ContractYield {...fixture} />);
    // 2 + 1 entities = 3; events = 3 — both appear as section counts
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(2);
  });

  it("renders each service with its comma-joined entity list", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.getByText("ServiceA")).toBeInTheDocument();
    expect(screen.getByText("ServiceB")).toBeInTheDocument();
    expect(screen.getByText("EntityX, EntityY")).toBeInTheDocument();
    expect(screen.getByText("EntityZ")).toBeInTheDocument();
  });

  it("renders the events as a single comma-joined line", () => {
    render(<ContractYield {...fixture} />);
    expect(
      screen.getByText("EventOne, EventTwo, EventThree"),
    ).toBeInTheDocument();
  });

  it("does not render a 'never published' footnote", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.queryByText(/never published/i)).not.toBeInTheDocument();
  });

  it("falls back to Exhibit A defaults when no props are passed", () => {
    render(<ContractYield />);
    // 28 entities total, 13 events
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("13")).toBeInTheDocument();
    expect(screen.getByText(/OrderPlaced.*ShipmentReturned/)).toBeInTheDocument();
  });
});
