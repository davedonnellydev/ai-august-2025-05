'use client';

import { useRef, useState } from 'react';
import { IconAnalyze, IconFileText, IconUpload } from '@tabler/icons-react';
import { Alert, Button, FileInput, Group, Paper, Stack, Text, Textarea } from '@mantine/core';
import styles from './UploadCV.module.css';

interface UploadCVProps {
  onAnalysisComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

export function UploadCV({ onAnalysisComplete, onError }: UploadCVProps) {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [_uploadedFile, setUploadedFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLButtonElement>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadedFile(null);
    setError(null);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(event.currentTarget.value);
    setUploadedFile(null);
    setError(null);
  };

  const uploadFileToOpenAI = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/openai/v1/files', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload file');
    }

    return await response.json();
  };

  const analyzeCV = async () => {
    setLoading(true);
    setError(null);

    try {
      let fileId: string | undefined;
      let input: string | undefined;

      if (inputMode === 'file' && selectedFile) {
        if (selectedFile.type !== 'application/pdf') {
          throw new Error('Only PDF files are supported');
        }

        // Upload file to OpenAI first
        const uploadedFileObject = await uploadFileToOpenAI(selectedFile);
        setUploadedFile(uploadedFileObject);
        fileId = uploadedFileObject.id;
      } else if (inputMode === 'text') {
        input = textInput.trim();
        if (!input) {
          throw new Error('Please provide CV content to analyze');
        }
      } else {
        throw new Error('Please provide CV content to analyze');
      }

      const requestBody: any = {};
      if (input) {
        requestBody.inputText = input;
      }
      if (fileId) {
        requestBody.fileId = fileId;
      }

      const response = await fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze CV');
      }

      const result = await response.json();
      onAnalysisComplete?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = () => {
    if (inputMode === 'text') {
      return textInput.trim().length > 0;
    }
    return selectedFile !== null && selectedFile.type === 'application/pdf';
  };

  return (
    <Paper className={styles.container} p="md" withBorder>
      <Stack gap="md">
        <Text size="lg" fw={600}>
          Upload CV for Analysis
        </Text>

        <Group gap="sm">
          <Button
            variant={inputMode === 'text' ? 'filled' : 'outline'}
            leftSection={<IconFileText size={16} />}
            onClick={() => setInputMode('text')}
          >
            Text Input
          </Button>
          <Button
            variant={inputMode === 'file' ? 'filled' : 'outline'}
            leftSection={<IconUpload size={16} />}
            onClick={() => setInputMode('file')}
          >
            File Upload
          </Button>
        </Group>

        {inputMode === 'text' ? (
          <Textarea
            placeholder="Paste your CV content here..."
            value={textInput}
            onChange={handleTextChange}
            minRows={8}
            maxRows={15}
            autosize
          />
        ) : (
          <FileInput
            ref={fileInputRef}
            placeholder="Upload your CV (PDF file only)"
            accept=".pdf"
            value={selectedFile}
            onChange={handleFileChange}
            leftSection={<IconUpload size={16} />}
          />
        )}

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        <Button
          leftSection={<IconAnalyze size={16} />}
          onClick={analyzeCV}
          loading={loading}
          disabled={!canAnalyze()}
          fullWidth
        >
          {loading ? 'Analyzing...' : 'Analyze CV'}
        </Button>
      </Stack>
    </Paper>
  );
}
