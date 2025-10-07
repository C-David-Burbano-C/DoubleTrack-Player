'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { Track } from '@/lib/types';
import { DoublyLinkedList, Node } from '@/lib/doublyLinkedList';
import { initialTracks } from '@/lib/tracks';

type AudioContextType = {
  playlist: DoublyLinkedList<Track>;
  currentTrackNode: Node<Track> | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: (node?: Node<Track>) => void;
  pause: () => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  playMode: 'linear' | 'shuffle';
  setPlayMode: (mode: 'linear' | 'shuffle') => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [playlist, setInternalPlaylist] = useState(
    () => new DoublyLinkedList<Track>(initialTracks)
  );
  const [playMode, setPlayMode] = useState<'linear' | 'shuffle'>('linear');
  const [currentTrackNode, setCurrentTrackNode] = useState<Node<Track> | null>(
    playlist.head
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Load tracks (initial + uploaded) from API
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/tracks');
        const data = await res.json();
        if (!cancelled && data?.success) {
          const tracks: Track[] = data.tracks;
          const newPlaylist = new DoublyLinkedList(tracks);
          setInternalPlaylist(newPlaylist);
          setCurrentTrackNode(newPlaylist.head);
        }
      } catch (e) {
        console.error('Failed to load tracks', e);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrackNode) {
      audioRef.current.src = currentTrackNode.value.url;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrackNode, isPlaying]);

  const play = useCallback((node?: Node<Track>) => {
    const targetNode = node || currentTrackNode || playlist.head;
    if (targetNode) {
      setCurrentTrackNode(targetNode);
      setIsPlaying(true);
    }
  }, [currentTrackNode, playlist.head]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const playNext = useCallback(() => {
    if (playMode === 'shuffle') {
      const arr = playlist.toArray();
      if (arr.length === 0) return;
      const rand = arr[Math.floor(Math.random() * arr.length)];
      const node = playlist.find((t) => t.id === rand.id);
      if (node) {
        play(node);
      }
      return;
    }

    if (currentTrackNode?.next) {
      play(currentTrackNode.next);
    } else {
      // Loop to the beginning
  play(playlist.head || undefined);
    }
  }, [currentTrackNode, playlist, play, playMode]);

  const playPrev = useCallback(() => {
    if (currentTrackNode?.prev) {
      play(currentTrackNode.prev);
    } else {
       // Loop to the end
  play(playlist.tail || undefined);
    }
  }, [currentTrackNode, playlist.tail, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  }, []);
  
  const setPlaylist = useCallback((tracks: Track[]) => {
    const newPlaylist = new DoublyLinkedList(tracks);
    setInternalPlaylist(newPlaylist);
    if (isPlaying) {
        pause();
    }
    setCurrentTrackNode(newPlaylist.head);
    setProgress(0);
    setDuration(0);
  }, [isPlaying, pause]);


  const value = useMemo(
    () => ({
      playlist,
      currentTrackNode,
      isPlaying,
      progress,
      duration,
      volume,
      play,
      pause,
      togglePlayPause,
      playNext,
      playPrev,
      seek,
      setVolume,
      setPlaylist,
      playMode,
      setPlayMode,
    }),
    [
      playlist,
      currentTrackNode,
      isPlaying,
      progress,
      duration,
      volume,
      play,
      pause,
      togglePlayPause,
      playNext,
      playPrev,
      seek,
      setVolume,
      setPlaylist,
      playMode,
      setPlayMode,
    ]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
