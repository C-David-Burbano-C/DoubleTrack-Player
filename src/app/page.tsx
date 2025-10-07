import Header from '@/components/Header';
import PlayerControls from '@/components/player/PlayerControls';
import { PlaylistView } from '@/components/player/PlaylistView';
import { TrackInfo } from '@/components/player/TrackInfo';
import { AudioProvider } from '@/components/player/AudioProvider';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <AudioProvider>
      <div className="flex h-screen w-full flex-col bg-background">
        <Header />
        <main className="flex-1 overflow-hidden p-4 md:p-8">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card className="flex h-full flex-col items-center justify-center p-6 shadow-2xl">
                <div className="flex w-full flex-col items-center space-y-6">
                  <TrackInfo />
                  <PlayerControls />
                </div>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card className="h-full shadow-2xl">
                <CardContent className="h-full p-4 md:p-6">
                  <PlaylistView />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AudioProvider>
  );
}
