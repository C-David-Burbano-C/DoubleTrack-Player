'use client';
import Image from 'next/image';
import { useAudio } from './AudioProvider';
import { cn } from '@/lib/utils';
import { Music } from 'lucide-react';

export function TrackInfo() {
  const { currentTrackNode, isPlaying } = useAudio();
  const track = currentTrackNode?.value;

  return (
    <div className="flex w-full flex-col items-center space-y-4 text-center">
      <div
        className={cn(
          'relative h-48 w-48 overflow-hidden rounded-full shadow-lg ring-4 ring-primary/20 transition-transform duration-300 md:h-64 md:w-64',
          isPlaying && 'scale-105'
        )}
      >
        {track?.albumArtUrl ? (
          <Image
            src={track.albumArtUrl}
            alt={track.title}
            width={256}
            height={256}
            data-ai-hint={track.albumArtHint}
            className={cn(
              'h-full w-full object-cover',
              isPlaying && 'animate-spin-slow'
            )}
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary">
            <Music className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground truncate max-w-[250px]">
          {track?.title || 'Select a song'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {track?.artist || 'DoubleTrack Player'}
        </p>
      </div>
    </div>
  );
}
