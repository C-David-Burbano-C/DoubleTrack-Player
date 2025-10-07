import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audioFile') as any;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    const type: string | undefined = file.type;
    const size: number | undefined = file.size;

    if (!type || !type.startsWith('audio/')) {
      return NextResponse.json({ success: false, error: 'Uploaded file is not an audio type.' }, { status: 400 });
    }

    const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
    if (typeof size === 'number' && size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: 'File is too large (limit 50MB).' }, { status: 413 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const originalName = (file.name || `upload-${Date.now()}`).toString();
    const sanitized = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${Date.now()}-${sanitized}`;
    const destPath = path.join(uploadsDir, filename);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destPath, buffer);

    const publicUrl = `/uploads/${filename}`;
    console.log('API upload saved to', destPath);

    // Persist minimal metadata to data/uploaded-tracks.json
    try {
      const dataPath = path.join(process.cwd(), 'data', 'uploaded-tracks.json');
      let existing: any[] = [];
      try {
        const raw = await fs.readFile(dataPath, 'utf-8');
        existing = JSON.parse(raw || '[]');
      } catch (e) {
        existing = [];
      }

      const newEntry = {
        id: Date.now().toString(),
        title: sanitized,
        artist: 'Uploaded',
        url: publicUrl,
        albumArtUrl: '',
        albumArtHint: ''
      };
      existing.push(newEntry);
      await fs.writeFile(dataPath, JSON.stringify(existing, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist uploaded track metadata', e);
    }

    return NextResponse.json({ success: true, message: 'File uploaded.', url: publicUrl });
  } catch (err: any) {
    console.error('API upload error', err);
    return NextResponse.json({ success: false, error: String(err?.message || err) }, { status: 500 });
  }
}
