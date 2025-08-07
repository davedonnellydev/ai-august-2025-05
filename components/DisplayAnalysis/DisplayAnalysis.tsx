'use client';

import { Paper, Text, Button, Stack, Alert, Group, Badge } from '@mantine/core';
import { IconArrowLeft, IconFileText, IconCheck } from '@tabler/icons-react';
import styles from './DisplayAnalysis.module.css';

interface DisplayAnalysisProps {
  analysisResult: {
    response: string;
    originalInput?: string;
    remainingRequests?: number;
  };
  onReset: () => void;
}

export function DisplayAnalysis({ analysisResult, onReset }: DisplayAnalysisProps) {
  return (
    <div className={styles.container}>
      <Stack gap="lg">
        {/* Header with back button */}
        <Group justify="space-between" align="center">
          <Text size="xl" fw={600}>
            CV Analysis Results
          </Text>
          <Button
            variant="outline"
            leftSection={<IconArrowLeft size={16} />}
            onClick={onReset}
          >
            Analyze Another CV
          </Button>
        </Group>

        {/* Success indicator */}
        <Alert icon={<IconCheck size={16} />} title="Analysis Complete" color="green">
          Your CV has been successfully analyzed by our AI system.
        </Alert>

        {/* Analysis content */}
        <Paper p="lg" withBorder className={styles.analysisContent}>
          <Stack gap="md">
            <Group gap="sm">
              <IconFileText size={20} />
              <Text size="lg" fw={600}>
                Analysis Summary
              </Text>
            </Group>

            <div className={styles.responseText}>
              <Text>{analysisResult.response}</Text>
            </div>
          </Stack>
        </Paper>

        {/* Additional info */}
        {analysisResult.remainingRequests !== undefined && (
          <Paper p="md" withBorder>
            <Group gap="sm">
              <Text size="sm" c="dimmed">
                Remaining analyses:
              </Text>
              <Badge variant="light" color="blue">
                {analysisResult.remainingRequests}
              </Badge>
            </Group>
          </Paper>
        )}
      </Stack>
    </div>
  );
}
