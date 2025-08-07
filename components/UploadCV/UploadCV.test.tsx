import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@/test-utils';
import { UploadCV } from './UploadCV';

// Mock fetch
global.fetch = jest.fn();

describe('UploadCV', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload CV component', () => {
    render(<UploadCV />);
    expect(screen.getByText('Upload CV for Analysis')).toBeInTheDocument();
    expect(screen.getByText('Text Input')).toBeInTheDocument();
    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Analyze CV')).toBeInTheDocument();
  });

  it('switches between text and file input modes', () => {
    render(<UploadCV />);

    // Default to text mode
    expect(screen.getByPlaceholderText('Paste your CV content here...')).toBeInTheDocument();

    // Switch to file mode
    fireEvent.click(screen.getByText('File Upload'));
    expect(screen.getByText('Upload your CV (PDF file only)')).toBeInTheDocument();

    // Switch back to text mode
    fireEvent.click(screen.getByText('Text Input'));
    expect(screen.getByPlaceholderText('Paste your CV content here...')).toBeInTheDocument();
  });

  it('enables analyze button when text is provided', () => {
    render(<UploadCV />);

    const analyzeButton = screen.getByRole('button', { name: 'Analyze CV' });
    expect(analyzeButton).toBeDisabled();

    const textarea = screen.getByPlaceholderText('Paste your CV content here...');
    fireEvent.change(textarea, { target: { value: 'Sample CV content' } });

    expect(analyzeButton).toBeEnabled();
  });

  it('calls onAnalysisComplete when analysis is successful', async () => {
    const mockOnAnalysisComplete = jest.fn();
    const mockResponse = { response: 'Analysis result', originalInput: 'Sample CV' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<UploadCV onAnalysisComplete={mockOnAnalysisComplete} />);

    const textarea = screen.getByPlaceholderText('Paste your CV content here...');
    fireEvent.change(textarea, { target: { value: 'Sample CV content' } });

    const analyzeButton = screen.getByRole('button', { name: 'Analyze CV' });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('calls onError when analysis fails', async () => {
    const mockOnError = jest.fn();

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Analysis failed' }),
    });

    render(<UploadCV onError={mockOnError} />);

    const textarea = screen.getByPlaceholderText('Paste your CV content here...');
    fireEvent.change(textarea, { target: { value: 'Sample CV content' } });

    const analyzeButton = screen.getByRole('button', { name: 'Analyze CV' });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Analysis failed');
    });
  });

  it('shows file upload interface when file mode is selected', () => {
    render(<UploadCV />);

    // Switch to file mode
    fireEvent.click(screen.getByText('File Upload'));

    // Check that file upload interface is shown
    expect(screen.getByText('Upload your CV (PDF file only)')).toBeInTheDocument();

    // Check that analyze button is disabled initially (no file selected)
    const analyzeButton = screen.getByRole('button', { name: 'Analyze CV' });
    expect(analyzeButton).toBeDisabled();
  });
});
