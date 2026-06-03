import { render, screen } from "@testing-library/react";
import { ContractYield } from "./ContractYield";

const fixture = {
  totalSchemas: 54,
  noiseStripped: 26,
  services: [
    { name: "ServiceA", entities: ["EntityX", "EntityY"] },
    {
      name: "ServiceB",
      entities: ["EntityZ"],
      flag: { text: "NONE events", tone: "danger" as const },
    },
  ],
  domainEvents: ["EventOne", "EventTwo", "EventThree"],
};

describe("ContractYield", () => {
  it("renders the extraction math: raw schemas, noise stripped, entity total, event total", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.getByText("54")).toBeInTheDocument();
    expect(screen.getByText("−26")).toBeInTheDocument();
    // total entities = 2 + 1 = 3, which collides with event count 3, so getAll
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(2);
  });

  it("renders a column per service with its entity list", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.getByText("ServiceA")).toBeInTheDocument();
    expect(screen.getByText("ServiceB")).toBeInTheDocument();
    expect(screen.getByText("EntityX")).toBeInTheDocument();
    expect(screen.getByText("EntityY")).toBeInTheDocument();
    expect(screen.getByText("EntityZ")).toBeInTheDocument();
  });

  it("pluralises the entity-count label correctly per column", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.getByText(/^2 entities$/)).toBeInTheDocument();
    expect(screen.getByText(/^1 entity$/)).toBeInTheDocument();
  });

  it("renders the anomaly flag on a column when provided", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.getByText("NONE events")).toBeInTheDocument();
  });

  it("renders every domain event as a chip", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.getByText("EventOne")).toBeInTheDocument();
    expect(screen.getByText("EventTwo")).toBeInTheDocument();
    expect(screen.getByText("EventThree")).toBeInTheDocument();
  });

  it("renders the 'never published' footnote on the events strip", () => {
    render(<ContractYield {...fixture} />);
    expect(screen.getByText(/never published/i)).toBeInTheDocument();
  });
});
