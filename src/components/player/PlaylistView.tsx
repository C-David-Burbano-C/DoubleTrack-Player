'use client';
import { useState } from 'react';
import { useAudio } from './AudioProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Wand2, Music, AudioLines } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Track } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generatePlaylistAction } from '@/app/actions';

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
        <AIPlaylistGenerator />
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

function AIPlaylistGenerator() {
  const { setPlaylist } = useAudio();
  const { toast } = useToast();
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!mood) {
      toast({
        variant: 'destructive',
        title: 'Mood is required',
        description: 'Please enter a mood to generate a playlist.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await generatePlaylistAction(mood);
      if (result.success && result.playlist) {
        setPlaylist(result.playlist);
        toast({
          title: 'Playlist Generated!',
          description: `Here is your new playlist for a "${mood}" mood.`,
        });
        setOpen(false);
        setMood('');
      } else {
        throw new Error(result.error || 'Failed to generate playlist.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          AI Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Playlist with AI</DialogTitle>
          <DialogDescription>
            Enter a mood, genre, or vibe, and our AI will curate a playlist for you from your library.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="e.g., Chill morning, 80s rock, energetic workout"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
