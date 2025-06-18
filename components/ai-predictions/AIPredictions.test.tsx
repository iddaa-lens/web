import { render, screen, fireEvent } from "@testing-library/react";
import { AIPredictions, mockAIPredictions, type AIPrediction } from "./AIPredictions";

describe("AIPredictions", () => {
  const mockOnPredictionClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders predictions correctly", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions} 
      />
    );
    
    // Check that predictions are rendered
    expect(screen.getByText("Liverpool")).toBeInTheDocument();
  });

  it("displays correct number of predictions based on maxItems", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
        maxItems={3}
      />
    );
    
    const predictions = screen.getAllByText(/Liverpool|Real Madrid|Bayern Munich/);
    expect(predictions).toHaveLength(3);
  });


  it("calls onPredictionClick when prediction is clicked", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
        onPredictionClick={mockOnPredictionClick}
      />
    );
    
    const firstPrediction = screen.getByText("Liverpool").closest(".group");
    fireEvent.click(firstPrediction!);
    
    expect(mockOnPredictionClick).toHaveBeenCalledWith(mockAIPredictions[0]);
  });


  it("shows reasoning text with ellipsis", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
      />
    );
    
    expect(screen.getByText("Ev sahibi son 5 maçta yenilmedi, deplasman takımı 3 eksik...")).toBeInTheDocument();
  });


  it("displays correct outcome labels", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
      />
    );
    
    // Use getAllByText since there might be multiple predictions with same outcome
    expect(screen.getAllByText("Ev Sahibi").length).toBeGreaterThan(0); // Outcome "1"
    expect(screen.getByText("Beraberlik")).toBeInTheDocument(); // Outcome "X"
  });

  it("shows confidence with correct color coding", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
      />
    );
    
    // High confidence (87%) should have green color class
    const highConfidence = screen.getByText("%87");
    expect(highConfidence.parentElement).toHaveClass("text-green-600");
    
    // Medium confidence (72%) should have yellow color class
    const mediumConfidence = screen.getByText("%72");
    expect(mediumConfidence.parentElement).toHaveClass("text-yellow-600");
  });

  it("displays odds correctly", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
      />
    );
    
    expect(screen.getByText("@1.85")).toBeInTheDocument();
    expect(screen.getByText("@3.20")).toBeInTheDocument();
  });

  it("shows league and time information", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
      />
    );
    
    // League and time are now in a span element
    const leagueTimeElements = screen.getAllByText(/Premier League|La Liga/);
    expect(leagueTimeElements.length).toBeGreaterThan(0);
  });

  it("displays predictor names", () => {
    render(
      <AIPredictions 
        predictions={mockAIPredictions}
      />
    );
    
    expect(screen.getByText("Algoritma Usta")).toBeInTheDocument();
    expect(screen.getByText("Yapay Zeki")).toBeInTheDocument();
    expect(screen.getByText("RoboTahmin")).toBeInTheDocument();
  });

  it("handles empty predictions array", () => {
    render(
      <AIPredictions 
        predictions={[]}
      />
    );
    
    // Should render empty container
    expect(screen.queryByText("Liverpool")).not.toBeInTheDocument();
  });

  it("renders confidence icons for high confidence predictions", () => {
    const highConfidencePrediction: AIPrediction = {
      ...mockAIPredictions[0],
      prediction: {
        ...mockAIPredictions[0].prediction,
        confidence: 85,
      },
    };

    render(
      <AIPredictions 
        predictions={[highConfidencePrediction]}
      />
    );
    
    // Check that the confidence element contains the icon
    const confidenceElement = screen.getByText("%85").parentElement;
    expect(confidenceElement?.querySelector("svg")).toBeInTheDocument();
  });
});