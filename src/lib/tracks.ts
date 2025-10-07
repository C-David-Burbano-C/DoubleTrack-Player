import type { Track } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
};
const getImageHint = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageHint || '';
}

export const initialTracks: Track[] = [
  {
    id: '1',
    title: 'Creative Minds',
    artist: 'Bensound',
    url: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3',
    albumArtUrl: getImageUrl('creative-minds'),
    albumArtHint: getImageHint('creative-minds'),
  },
  {
    id: '2',
    title: 'Jazzy Frenchy',
    artist: 'Bensound',
    url: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3',
    albumArtUrl: getImageUrl('jazzy-frenchy'),
    albumArtHint: getImageHint('jazzy-frenchy'),
  },
  {
    id: '3',
    title: 'Tomorrow',
    artist: 'Bensound',
    url: 'https://www.bensound.com/bensound-music/bensound-tomorrow.mp3',
    albumArtUrl: getImageUrl('tomorrow'),
    albumArtHint: getImageHint('tomorrow'),
  },
  {
    id: '4',
    title: 'Once Again',
    artist: 'Bensound',
    url: 'https://www.bensound.com/bensound-music/bensound-onceagain.mp3',
    albumArtUrl: getImageUrl('once-again'),
    albumArtHint: getImageHint('once-again'),
  },
  {
    id: '5',
    title: 'Dreams',
    artist: 'Bensound',
    url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
    albumArtUrl: getImageUrl('dreams'),
    albumArtHint: getImageHint('dreams'),
  },
  {
    id: '6',
    title: 'Summer',
    artist: 'Bensound',
    url: 'https://www.bensound.com/bensound-music/bensound-summer.mp3',
    albumArtUrl: getImageUrl('summer'),
    albumArtHint: getImageHint('summer'),
  },
];
