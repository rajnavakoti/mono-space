import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function renderHeader() {
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}

describe("Header", () => {
  it("renders the logo", () => {
    renderHeader();
    expect(screen.getByText(/RAJ/)).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Presentations" })
    ).toBeInTheDocument();
  });

  it("marks the current page link as active", () => {
    renderHeader();
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
