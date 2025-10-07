'use client';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudio } from './AudioProvider';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PlayerControls() {
  const {
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    progress,
    duration,
    seek,
    volume,
    setVolume,
  } = useAudio();
  
  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 1);
  };


  return (
    <div className="w-full max-w-sm space-y-4">
       <div className="w-full space-y-1">
        <Slider
            value={[progress]}
            max={duration || 1}
            step={1}
            onValueChange={handleSeek}
            className="w-full cursor-pointer"
            aria-label="Track progress"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={playPrev} aria-label="Previous track">
          <SkipBack className="h-6 w-6" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 fill-primary-foreground" />
          ) : (
            <Play className="h-8 w-8 fill-primary-foreground" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={playNext} aria-label="Next track">
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={volume > 0 ? "Mute" : "Unmute"}>
            {volume === 0 ? <VolumeX className="h-5 w-5"/> : <Volume2 className="h-5 w-5"/>}
        </Button>
        <Slider
          value={[volume]}
          max={1}
          step={0.05}
          onValueChange={handleVolumeChange}
          className="w-full cursor-pointer"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
}
