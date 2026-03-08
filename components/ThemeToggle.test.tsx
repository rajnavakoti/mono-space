import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders with dark mode label by default", () => {
    renderWithTheme();
    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  it("displays [LT] text in dark mode", () => {
    renderWithTheme();
    expect(screen.getByText("[LT]")).toBeInTheDocument();
  });

  it("toggles to light mode on click", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const button = screen.getByRole("button", { name: /switch to light mode/i });
    await user.click(button);

    expect(screen.getByText("[DK]")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  it("persists theme to localStorage", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));

    expect(localStorageMock.getItem("theme")).toBe("light");
  });
});
