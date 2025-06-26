"use client";

import React from "react";
import { Upload, FileAudio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  handleFileUpload: (files: FileList | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  handleFileUpload
}) => {
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files);
    // Reset file input to allow uploading the same file(s) again
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 text-center p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Welcome to AudioScribe Sync
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Upload your audio and SRT files to begin.
        </p>
      </div>
      <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio /> Audio & Transcript Files
            </CardTitle>
            <CardDescription>
              Upload one or more audio (e.g., MP3, WAV) and transcript (.srt) files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-10 w-10" />
                <span>Click or drag to upload</span>
                <p className="text-xs">Files will be paired by name (e.g., audio.mp3 & audio.srt)</p>
              </div>
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept="audio/*,.srt"
              className="hidden"
              onChange={onFileChange}
              multiple
            />
          </CardContent>
        </Card>
    </div>
  );
};

export default FileUpload;
