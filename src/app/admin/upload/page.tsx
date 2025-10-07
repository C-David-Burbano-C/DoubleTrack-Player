import Header from '@/components/Header';
import { FileUpload } from '@/components/admin/FileUpload';

export default function AdminUploadPage() {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-background p-4 md:p-8">
        <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center">
            <FileUpload />
        </div>
      </main>
    </div>
  );
}
