import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { LeftDrawer } from "./LeftDrawer";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LeftDrawer", () => {
  const mockPush = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders all menu items when open", () => {
    render(<LeftDrawer open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Etkinlikler")).toBeInTheDocument();
    expect(screen.getByText("Tahminler")).toBeInTheDocument();
    expect(screen.getByText("AI Modelleri")).toBeInTheDocument();
    expect(screen.getByText("Takımlar")).toBeInTheDocument();
    expect(screen.getByText("Ligler")).toBeInTheDocument();
    expect(screen.getByText("Sporlar")).toBeInTheDocument();
  });

  it("does not show drawer when closed", () => {
    render(<LeftDrawer open={false} onClose={mockOnClose} />);

    const drawer = screen.getByRole("navigation", { name: "Main navigation" });
    expect(drawer).toHaveClass("-translate-x-full");
  });

  it("shows drawer when open", () => {
    render(<LeftDrawer open={true} onClose={mockOnClose} />);

    const drawer = screen.getByRole("navigation", { name: "Main navigation" });
    expect(drawer).toHaveClass("translate-x-0");
  });

  it("navigates to correct route when menu item is clicked", () => {
    render(<LeftDrawer open={true} onClose={mockOnClose} />);

    const eventsButton = screen.getByText("Etkinlikler");
    fireEvent.click(eventsButton);

    expect(mockPush).toHaveBeenCalledWith("/events");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes drawer when backdrop is clicked", () => {
    render(<LeftDrawer open={true} onClose={mockOnClose} />);

    // Find the backdrop by its click handler
    const backdrop = document.querySelector('.bg-black\\/50');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("navigates to all routes correctly", () => {
    render(<LeftDrawer open={true} onClose={mockOnClose} />);

    const routes = [
      { text: "Etkinlikler", href: "/events" },
      { text: "Tahminler", href: "/predictions" },
      { text: "AI Modelleri", href: "/ai-models" },
      { text: "Takımlar", href: "/teams" },
      { text: "Ligler", href: "/leagues" },
      { text: "Sporlar", href: "/sports" },
    ];

    routes.forEach(({ text, href }) => {
      const button = screen.getByText(text);
      fireEvent.click(button);
      expect(mockPush).toHaveBeenCalledWith(href);
      expect(mockOnClose).toHaveBeenCalled();
      jest.clearAllMocks();
    });
  });

  it("hides backdrop when closed", () => {
    const { rerender, container } = render(<LeftDrawer open={false} onClose={mockOnClose} />);

    let backdropContainer = container.querySelector('[aria-hidden="true"]');
    expect(backdropContainer).toHaveClass("opacity-0", "pointer-events-none");

    rerender(<LeftDrawer open={true} onClose={mockOnClose} />);

    backdropContainer = container.querySelector('[aria-hidden="true"]');
    expect(backdropContainer).toHaveClass("opacity-100");
    expect(backdropContainer).not.toHaveClass("pointer-events-none");
  });

  it("renders icons for each menu item", () => {
    render(<LeftDrawer open={true} onClose={mockOnClose} />);

    const buttons = screen.getAllByRole("button");
    // Exclude the backdrop button
    const menuButtons = buttons.filter((button) => 
      button.textContent && button.textContent.length > 0
    );

    expect(menuButtons).toHaveLength(6);
    menuButtons.forEach((button) => {
      // Check that each button has an SVG icon
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("applies correct styles to menu buttons", () => {
    render(<LeftDrawer open={true} onClose={mockOnClose} />);

    const eventsButton = screen.getByText("Etkinlikler").closest("button");
    expect(eventsButton).toHaveClass("rounded-md", "w-full");
  });
});