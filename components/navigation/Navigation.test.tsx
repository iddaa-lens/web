import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navigation } from "./Navigation";
import { useDarkMode } from "@/hooks/useDarkMode";

// Mock the dark mode hook
jest.mock("@/hooks/useDarkMode", () => ({
  useDarkMode: jest.fn()
}));

describe("Navigation", () => {
  const mockOnMenuClick = jest.fn();
  const mockOnRegisterClick = jest.fn();
  const mockToggleDarkMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDarkMode as jest.Mock).mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: mockToggleDarkMode,
      mounted: true
    });
  });

  it("renders the logo", () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    expect(screen.getByText("IddaaLens")).toBeInTheDocument();
  });

  it("calls onMenuClick when menu button is clicked", () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    const menuButton = screen.getByLabelText("Open menu");
    fireEvent.click(menuButton);
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it("toggles search input when search button is clicked", async () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    // Initially search input should not be visible
    expect(screen.queryByPlaceholderText("Ara...")).not.toBeInTheDocument();
    
    // Click search button
    const searchButton = screen.getByLabelText("Open search");
    fireEvent.click(searchButton);
    
    // Search input should now be visible
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Ara...")).toBeInTheDocument();
    });
  });

  it("closes search when X button is clicked", async () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    // Open search
    fireEvent.click(screen.getByLabelText("Open search"));
    
    // Close search
    const closeButton = await screen.findByLabelText("Close search");
    fireEvent.click(closeButton);
    
    // Search input should not be visible
    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Ara...")).not.toBeInTheDocument();
    });
  });

  it("toggles dark mode when theme button is clicked", () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    const themeButton = screen.getByLabelText("Switch to dark mode");
    fireEvent.click(themeButton);
    
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
  });

  it("shows sun icon in dark mode", () => {
    (useDarkMode as jest.Mock).mockReturnValue({
      isDarkMode: true,
      toggleDarkMode: mockToggleDarkMode,
      mounted: true
    });
    
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    const themeButton = screen.getByLabelText("Switch to light mode");
    expect(themeButton).toBeInTheDocument();
  });

  it("calls onRegisterClick when register button is clicked", () => {
    render(<Navigation onMenuClick={mockOnMenuClick} onRegisterClick={mockOnRegisterClick} />);
    
    const registerButton = screen.getByLabelText("Register");
    fireEvent.click(registerButton);
    
    expect(mockOnRegisterClick).toHaveBeenCalledTimes(1);
  });

  it("does not show theme toggle when not mounted", () => {
    (useDarkMode as jest.Mock).mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: mockToggleDarkMode,
      mounted: false
    });
    
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    expect(screen.queryByLabelText("Switch to dark mode")).not.toBeInTheDocument();
  });

  it("maintains search query state", async () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    // Open search
    fireEvent.click(screen.getByLabelText("Open search"));
    
    // Type in search input
    const searchInput = await screen.findByPlaceholderText("Ara...");
    fireEvent.change(searchInput, { target: { value: "test query" } });
    
    expect(searchInput).toHaveValue("test query");
  });

  it("hides search input on blur when empty", async () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    // Open search
    fireEvent.click(screen.getByLabelText("Open search"));
    
    // Blur empty search input
    const searchInput = await screen.findByPlaceholderText("Ara...");
    fireEvent.blur(searchInput);
    
    // Search input should not be visible
    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Ara...")).not.toBeInTheDocument();
    });
  });

  it("keeps search input visible on blur when has value", async () => {
    render(<Navigation onMenuClick={mockOnMenuClick} />);
    
    // Open search and type
    fireEvent.click(screen.getByLabelText("Open search"));
    const searchInput = await screen.findByPlaceholderText("Ara...");
    fireEvent.change(searchInput, { target: { value: "test" } });
    
    // Blur search input
    fireEvent.blur(searchInput);
    
    // Search input should still be visible
    expect(screen.getByPlaceholderText("Ara...")).toBeInTheDocument();
  });
});