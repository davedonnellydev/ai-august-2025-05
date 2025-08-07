import type { Meta, StoryObj } from '@storybook/react';
import { UploadCV } from './UploadCV';

const meta: Meta<typeof UploadCV> = {
  title: 'Components/UploadCV',
  component: UploadCV,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onAnalysisComplete: { action: 'analysis complete' },
    onError: { action: 'error' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCallbacks: Story = {
  args: {
    onAnalysisComplete: (result) => console.log('Analysis complete:', result),
    onError: (error) => console.error('Error:', error),
  },
};
