import { fireEvent, screen } from '@testing-library/react';
import { render } from '@/test-utils';
import { DisplayAnalysis } from './DisplayAnalysis';

describe('DisplayAnalysis', () => {
  const mockAnalysisResult = {
    response: 'This is a sample CV analysis result.',
    originalInput: 'Sample CV content',
    remainingRequests: 5,
  };

  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders analysis results', () => {
    render(<DisplayAnalysis analysisResult={mockAnalysisResult} onReset={mockOnReset} />);

    expect(screen.getByText('CV Analysis Results')).toBeInTheDocument();
    expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
    expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
    expect(screen.getByText(mockAnalysisResult.response)).toBeInTheDocument();
  });

  it('displays remaining requests when available', () => {
    render(<DisplayAnalysis analysisResult={mockAnalysisResult} onReset={mockOnReset} />);

    expect(screen.getByText('Remaining analyses:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onReset when "Analyze Another CV" button is clicked', () => {
    render(<DisplayAnalysis analysisResult={mockAnalysisResult} onReset={mockOnReset} />);

    const resetButton = screen.getByText('Analyze Another CV');
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('does not display remaining requests when not available', () => {
    const resultWithoutRemaining = {
      response: 'Analysis result',
      originalInput: 'CV content',
    };

    render(<DisplayAnalysis analysisResult={resultWithoutRemaining} onReset={mockOnReset} />);

    expect(screen.queryByText('Remaining analyses:')).not.toBeInTheDocument();
  });
});
