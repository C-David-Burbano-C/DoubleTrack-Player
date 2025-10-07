import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { initialTracks } from '@/lib/tracks';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'uploaded-tracks.json');
    let uploaded: any[] = [];
    try {
      const raw = await fs.readFile(dataPath, 'utf-8');
      uploaded = JSON.parse(raw || '[]');
    } catch (e) {
      uploaded = [];
    }

    const combined = [...initialTracks, ...uploaded];
    return NextResponse.json({ success: true, tracks: combined });
  } catch (err: any) {
    console.error('tracks API error', err);
    return NextResponse.json({ success: false, error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'data', 'uploaded-tracks.json');
    let uploaded: any[] = [];
    try {
      const raw = await fs.readFile(dataPath, 'utf-8');
      uploaded = JSON.parse(raw || '[]');
    } catch (e) {
      uploaded = [];
    }

    const idx = uploaded.findIndex((t) => t.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Track not found' }, { status: 404 });
    }

    const [removed] = uploaded.splice(idx, 1);

    // try remove physical file if it resides in /uploads
    try {
      if (removed && removed.url && removed.url.startsWith('/uploads/')) {
        const fname = removed.url.replace('/uploads/', '');
        const filePath = path.join(process.cwd(), 'public', 'uploads', fname);
        await fs.unlink(filePath).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to remove file', e);
    }

    await fs.writeFile(dataPath, JSON.stringify(uploaded, null, 2), 'utf-8');

    const combined = [...initialTracks, ...uploaded];
    return NextResponse.json({ success: true, tracks: combined });
  } catch (err: any) {
    console.error('tracks DELETE error', err);
    return NextResponse.json({ success: false, error: String(err?.message || err) }, { status: 500 });
  }
}
