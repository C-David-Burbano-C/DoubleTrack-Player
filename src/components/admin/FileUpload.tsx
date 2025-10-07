'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileAudio, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileAction } from '@/app/actions';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  audioFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Please select a file.')
    .refine(
      (file) => file.type.startsWith('audio/'),
      'Please select an audio file.'
    ),
});

export function FileUpload() {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { formState, setValue, handleSubmit, reset } = form;

  const handleFileChange = (file: File | null) => {
    if (file) {
      setValue('audioFile', file, { shouldValidate: true });
      setFileName(file.name);
    }
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
        handleFileChange(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('audioFile', values.audioFile);
    
    const result = await uploadFileAction(formData);

    if (result.success) {
      toast({
        title: 'Upload Successful',
        description: result.message,
      });
      reset();
      setFileName(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: result.error,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Music</CardTitle>
        <CardDescription>
          Upload an audio file to add it to the music library.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="audioFile"
              render={() => (
                <FormItem>
                  <FormLabel>Audio File</FormLabel>
                  <FormControl>
                    <div 
                      className={cn(
                        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors",
                        isDragging ? "border-primary bg-accent/50" : "border-input hover:border-primary/50"
                      )}
                      onDragEnter={onDragEnter}
                      onDragLeave={onDragLeave}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {fileName ? (
                         <div className="flex flex-col items-center gap-2 text-foreground">
                            <FileAudio className="h-10 w-10"/>
                            <p className="font-medium">{fileName}</p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-2 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    reset();
                                    setFileName(null);
                                    if(fileInputRef.current) fileInputRef.current.value = '';
                                }}
                            >
                                <X className="mr-2 h-4 w-4"/>
                                Remove
                            </Button>
                         </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <UploadCloud className="h-10 w-10" />
                            <p className="font-medium">Drag & drop or click to upload</p>
                            <p className="text-sm">MP3, WAV, FLAC, etc.</p>
                        </div>
                      )}
                       <Input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? 'Uploading...' : 'Upload File'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
