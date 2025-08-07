import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MODEL } from '@/app/config/constants';
import { InputValidator, ServerRateLimiter } from '@/app/lib/utils/api-helpers';

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Server-side rate limiting
    if (!ServerRateLimiter.checkLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { inputText, fileId } = await request.json();

    // Validate that either input or fileId is provided
    if (!inputText && !fileId) {
      return NextResponse.json(
        { error: 'Either input text or file ID must be provided' },
        { status: 400 }
      );
    }

    // Enhanced validation for text input
    if (inputText) {
      const textValidation = InputValidator.validateText(inputText, 2000);
      if (!textValidation.isValid) {
        return NextResponse.json({ error: textValidation.error }, { status: 400 });
      }
    }

    // Environment validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Translation service temporarily unavailable' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    // Enhanced content moderation for text input
    if (inputText) {
      const moderatedText = await client.moderations.create({
        input: inputText,
      });

      const { flagged, categories } = moderatedText.results[0];

      if (flagged) {
        const keys: string[] = Object.keys(categories);
        const flaggedCategories = keys.filter(
          (key: string) => categories[key as keyof typeof categories]
        );
        return NextResponse.json(
          {
            error: `Content flagged as inappropriate: ${flaggedCategories.join(', ')}`,
          },
          { status: 400 }
        );
      }
    }

    const instructions: string =
      'You are a helpful assistant who analyzes CV content. Provide a brief analysis of the CV, highlighting key skills, experience, and suggestions for improvement. Keep your response concise and professional.';

    const responseData: any = {
      model: MODEL,
      instructions,
      input: [
        {
          role: 'user',
          content: [],
        },
      ],
    };

    if (inputText) {
      responseData.input[0].content.push({
        type: 'text',
        text: inputText,
      });
    }

    if (fileId) {
      responseData.input[0].content.push({
        type: 'input_file',
        file_id: fileId,
      });
    }

    const response = await client.responses.create(responseData);

    if (response.status !== 'completed') {
      throw new Error(`Responses API error: ${response.status}`);
    }

    return NextResponse.json({
      response: response.output_text || 'Response recieved',
      originalInput: inputText || fileId,
      remainingRequests: ServerRateLimiter.getRemaining(ip),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
