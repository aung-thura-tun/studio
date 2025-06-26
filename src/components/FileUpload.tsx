"use client";

import React from "react";
import { Upload, FileAudio, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  audioFile: File | null;
  srtFile: File | null;
  handleAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSrtUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  audioFile,
  srtFile,
  handleAudioUpload,
  handleSrtUpload,
}) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio /> Audio File
            </CardTitle>
            <CardDescription>
              Upload your audio file (e.g., MP3, WAV).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label
              htmlFor="audio-upload"
              className={cn(
                "flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                audioFile && "border-primary"
              )}
            >
              <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span>{audioFile?.name || "Click or drag to upload"}</span>
              </div>
            </Label>
            <Input
              id="audio-upload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioUpload}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText /> Transcript File
            </CardTitle>
            <CardDescription>
              Upload your transcript file (.srt).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label
              htmlFor="srt-upload"
              className={cn(
                "flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                srtFile && "border-primary"
              )}
            >
              <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span>{srtFile?.name || "Click or drag to upload"}</span>
              </div>
            </Label>
            <Input
              id="srt-upload"
              type="file"
              accept=".srt"
              className="hidden"
              onChange={handleSrtUpload}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUpload;
