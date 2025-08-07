import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Environment validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'File upload service temporarily unavailable' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // Validate file size (OpenAI has a 512MB limit for files)
    const maxSize = 512 * 1024 * 1024; // 512MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 512MB limit' }, { status: 400 });
    }

    // Upload file to OpenAI
    const uploadedFile = await client.files.create({
      file,
      purpose: 'user_data',
    });

    return NextResponse.json({
      id: uploadedFile.id,
      object: uploadedFile.object,
      bytes: uploadedFile.bytes,
      created_at: uploadedFile.created_at,
      expires_at: uploadedFile.expires_at,
      filename: uploadedFile.filename,
      purpose: uploadedFile.purpose,
    });
  } catch (error) {
    console.error('File upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'File upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
