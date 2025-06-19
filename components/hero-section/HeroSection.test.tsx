import { render, screen } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

// Mock the SportsResponsive component
jest.mock("@/components/sports", () => ({
  SportsResponsive: jest.fn(({ selectedSports, onSportsSelect }) => (
    <div data-testid="sports-responsive">
      Selected: {selectedSports?.join(", ")}
      <button onClick={() => onSportsSelect?.(["football"])}>
        Select Football
      </button>
    </div>
  )),
}));

describe("HeroSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<HeroSection />);

    expect(screen.getByText("Akıllı bahis analizi")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Yapay zeka destekli tahminler ve gerçek zamanlı oran takibi ile kazanma şansınızı artırın."
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("sports-responsive")).toBeInTheDocument();
  });

  it("renders with custom title and subtitle", () => {
    render(
      <HeroSection
        title="Custom Title"
        subtitle="Custom subtitle text"
      />
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom subtitle text")).toBeInTheDocument();
  });

  it("hides sports section when showSports is false", () => {
    render(<HeroSection showSports={false} />);

    expect(screen.queryByTestId("sports-responsive")).not.toBeInTheDocument();
  });

  it("passes selectedSports to SportsResponsive", () => {
    render(<HeroSection selectedSports={["football", "basketball"]} />);

    expect(screen.getByText("Selected: football, basketball")).toBeInTheDocument();
  });

  it("calls onSportsSelect when sports are selected", () => {
    const mockOnSportsSelect = jest.fn();
    render(<HeroSection onSportsSelect={mockOnSportsSelect} />);

    const selectButton = screen.getByText("Select Football");
    selectButton.click();

    expect(mockOnSportsSelect).toHaveBeenCalledWith(["football"]);
  });

  it("applies custom className", () => {
    const { container } = render(<HeroSection className="custom-class" />);

    const heroDiv = container.firstChild;
    expect(heroDiv).toHaveClass("custom-class");
  });

  it("renders with responsive text sizes", () => {
    render(<HeroSection />);

    const title = screen.getByText("Akıllı bahis analizi");
    expect(title).toHaveClass("text-2xl", "sm:text-3xl", "md:text-4xl");

    const subtitle = screen.getByText(/Yapay zeka destekli tahminler/);
    expect(subtitle).toHaveClass("text-sm", "sm:text-base");
  });

  it("renders with proper spacing", () => {
    render(<HeroSection />);

    const title = screen.getByText("Akıllı bahis analizi");
    expect(title).toHaveClass("mb-2", "sm:mb-3");

    const textContainer = title.parentElement;
    expect(textContainer).toHaveClass("mb-6", "sm:mb-8");
  });

  it("centers content properly", () => {
    render(<HeroSection />);

    const textContainer = screen.getByText("Akıllı bahis analizi").parentElement;
    expect(textContainer).toHaveClass("text-center", "max-w-3xl", "mx-auto");
  });

  it("applies dark mode classes", () => {
    render(<HeroSection />);

    const title = screen.getByText("Akıllı bahis analizi");
    expect(title).toHaveClass("dark:text-white");

    const subtitle = screen.getByText(/Yapay zeka destekli tahminler/);
    expect(subtitle).toHaveClass("dark:text-gray-400");
  });
});