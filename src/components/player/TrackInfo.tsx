'use client';
import Image from 'next/image';
import { useAudio } from './AudioProvider';
import { cn } from '@/lib/utils';
import { Music } from 'lucide-react';
import { CircularProgress } from '@/components/player/CircularProgress';

export function TrackInfo() {
  const { currentTrackNode, isPlaying, progress, duration } = useAudio();
  const track = currentTrackNode?.value;

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex w-full flex-col items-center space-y-4 text-center">
      <div
        className={cn(
          'relative h-48 w-48 transition-transform duration-500 ease-in-out md:h-64 md:w-64',
          isPlaying ? 'scale-105' : 'scale-100'
        )}
      >
        <div
          className={cn(
            'relative h-full w-full overflow-hidden rounded-full shadow-lg ring-4 ring-primary/20'
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
                'h-full w-full object-cover transition-transform duration-1000',
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
        <CircularProgress
          progress={progressPercentage}
          className="absolute left-0 top-0 h-full w-full"
        />
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
