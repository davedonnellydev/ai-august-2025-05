import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    expect(screen.getByPlaceholderText('Upload your CV (PDF file only)')).toBeInTheDocument();

    // Switch back to text mode
    fireEvent.click(screen.getByText('Text Input'));
    expect(screen.getByPlaceholderText('Paste your CV content here...')).toBeInTheDocument();
  });

  it('enables analyze button when text is provided', () => {
    render(<UploadCV />);

    const analyzeButton = screen.getByText('Analyze CV');
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

    const analyzeButton = screen.getByText('Analyze CV');
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

    const analyzeButton = screen.getByText('Analyze CV');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Analysis failed');
    });
  });

  it('handles file upload and analysis', async () => {
    const mockOnAnalysisComplete = jest.fn();
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const mockUploadedFile = { id: 'file-abc123', filename: 'test.pdf' };
    const mockAnalysisResult = { response: 'Analysis result' };

    // Mock file upload
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUploadedFile,
      })
      // Mock analysis
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalysisResult,
      });

    render(<UploadCV onAnalysisComplete={mockOnAnalysisComplete} />);

    // Switch to file mode
    fireEvent.click(screen.getByText('File Upload'));

    const fileInput = screen.getByPlaceholderText('Upload your CV (PDF file only)');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const analyzeButton = screen.getByText('Analyze CV');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(mockOnAnalysisComplete).toHaveBeenCalledWith(mockAnalysisResult);
    });
  });
});
