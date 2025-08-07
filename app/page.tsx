'use client';

import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, AppShell, Paper, Stack, Title } from '@mantine/core';
import classes from '@/app/page.module.css';
import { DisplayAnalysis } from '@/components/DisplayAnalysis/DisplayAnalysis';
import { UploadCV } from '../components/UploadCV/UploadCV';

export default function HomePage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
  };

  return (
    <AppShell padding="md" header={{ height: 60, offset: true }}>
      <AppShell.Header>
        <Title className={classes.title} ta="center">
          CV Reviewer
        </Title>
      </AppShell.Header>
      <AppShell.Main className={classes.main}>
        {!analysisResult ? (
          <Stack gap="lg">
            <UploadCV onAnalysisComplete={handleAnalysisComplete} onError={handleError} />

            {error && (
              <Paper p="md" withBorder>
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                  {error}
                </Alert>
              </Paper>
            )}
          </Stack>
        ) : (
          <DisplayAnalysis
            analysisResult={analysisResult}
            onReset={() => {
              setAnalysisResult(null);
              setError(null);
            }}
          />
        )}
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
}
