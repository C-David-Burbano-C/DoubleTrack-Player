import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Upload } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tighter text-foreground">
            DoubleTrack Player
          </h1>
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/admin/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Music
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
