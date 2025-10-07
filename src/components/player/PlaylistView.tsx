'use client';
import { useState } from 'react';
import { useAudio } from './AudioProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Music, AudioLines } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Track } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function PlaylistView() {
  const { playlist, currentTrackNode, play, isPlaying } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');

  const allTracks = playlist.toArray();

  const filteredTracks = allTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search in playlist..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => {
              const node = playlist.find((t) => t.id === track.id);
              const isActive = currentTrackNode?.value.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => node && play(node)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-lg p-2 text-left transition-colors hover:bg-accent/50',
                    isActive && 'bg-accent'
                  )}
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                     {track.albumArtUrl ? (
                         <Image
                            src={track.albumArtUrl}
                            alt={track.title}
                            fill
                            className="object-cover"
                            data-ai-hint={track.albumArtHint}
                         />
                     ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary">
                            <Music className="h-6 w-6 text-muted-foreground" />
                        </div>
                     )}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-semibold truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>
                  {isActive && isPlaying && <AudioLines className="h-5 w-5 text-primary animate-pulse" />}
                </button>
              );
            })
          ) : (
            <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <p>No tracks found.</p>
              <p className="text-sm">Try a different search or upload new music.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
