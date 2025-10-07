'use client';
import { useState } from 'react';
import { useAudio } from './AudioProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Music, AudioLines, Play, Repeat, Shuffle, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Track } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export function PlaylistView() {
  const { playlist, currentTrackNode, play, isPlaying, playMode, setPlayMode, setPlaylist } = useAudio();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const allTracks = playlist.toArray();

  const filteredTracks = allTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <div className="flex h-full flex-col space-y-4 glass min-h-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => { setPlayMode('linear'); }} variant={playMode === 'linear' ? 'default' : 'ghost'} aria-label="Linear play">
            <Repeat className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => { setPlayMode('shuffle'); }} variant={playMode === 'shuffle' ? 'default' : 'ghost'} aria-label="Shuffle play">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => play()} className="ml-2" aria-label="Play">
            <Play className="h-4 w-4" />
          </Button>
        </div>
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
      {/* Limit the visible height so the list scrolls instead of stretching the page */}
      <ScrollArea className="flex-1 overflow-y-auto min-h-0 max-h-[60vh] sm:max-h-[480px]">
        <div className="space-y-2 pr-4 sm:pr-2">
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => {
              const node = playlist.find((t) => t.id === track.id);
              const isActive = currentTrackNode?.value.id === track.id;
              return (
                <div
                  key={track.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => node && play(node)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      node && play(node);
                    }
                  }}
                  className={cn(
                      'flex w-full items-center gap-4 rounded-lg p-3 sm:p-2 text-left transition-all',
                      'hover:translate-x-1 hover:scale-[1.01] hover:shadow-2xl',
                      isActive ? 'bg-accent glass-accent' : 'bg-transparent'
                    )}
                >
                  <div className="playlist-item-indicator mr-3 hidden sm:block" />
                  <div className="relative h-14 w-14 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-md">
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
                  <div className="flex items-center gap-2">
                    {isActive && isPlaying && <AudioLines className="h-5 w-5 text-primary animate-pulse" />}
                    {/* Show delete only for uploaded tracks (those without external url host) */}
                    {track.url.startsWith('/uploads/') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-2 touch-manipulation"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const res = await fetch(`/api/tracks?id=${track.id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              // update playlist in context
                              setPlaylist(data.tracks);
                              toast({ title: 'Deleted', description: 'Track removed.' });
                            } else {
                              toast({ variant: 'destructive', title: 'Delete failed', description: data.error || 'Unknown' });
                            }
                          } catch (err) {
                            toast({ variant: 'destructive', title: 'Delete failed', description: String(err) });
                          }
                        }}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
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
