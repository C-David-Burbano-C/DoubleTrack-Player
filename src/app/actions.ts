'use server';

import { initialTracks } from '@/lib/tracks';
import type { Track } from '@/lib/types';

import fs from 'fs/promises';
import path from 'path';

export async function uploadFileAction(formData: FormData) {
    'use server';

    try {
        const file: any = formData.get('audioFile');

        if (!file) {
            return { success: false, error: 'No file provided.' };
        }

        // Basic validation: ensure it's an audio file and not too large
        const type: string | undefined = file.type;
        const size: number | undefined = file.size;

        if (!type || !type.startsWith('audio/')) {
            return { success: false, error: 'Uploaded file is not an audio type.' };
        }

        const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
        if (typeof size === 'number' && size > MAX_BYTES) {
            return { success: false, error: 'File is too large (limit 50MB).' };
        }

        // Ensure uploads directory exists inside public
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        // Create a safe filename
        const originalName = (file.name || `upload-${Date.now()}`).toString();
        const sanitized = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const filename = `${Date.now()}-${sanitized}`;
        const destPath = path.join(uploadsDir, filename);

        // Read file contents and write to disk
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(destPath, buffer);

        const publicUrl = `/uploads/${filename}`;

        console.log('Saved uploaded file to', destPath);

        return { success: true, message: 'File uploaded successfully.', url: publicUrl };
    } catch (err: any) {
        console.error('uploadFileAction error', err);
        return { success: false, error: String(err?.message || err) };
    }
}
