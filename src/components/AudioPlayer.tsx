"use client";

import React from "react";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Volume2,
  Volume1,
  VolumeX,
  Sparkles,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import type { Subtitle } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioPlayerProps {
  audioFile: File | null;
  srtFile: File | null;
  subtitles: Subtitle[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isAiEnabled: boolean;
  summary: string;
  isSummarizing: boolean;
  playPause: () => void;
  skip: (seconds: number) => void;
  handleSeek: (time: number) => void;
  handleVolumeChange: (value: number[]) => void;
  handlePlaybackRateChange: (value: number[]) => void;
  handleToggleAi: (enabled: boolean) => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "00:00:00";
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioFile,
  srtFile,
  subtitles,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  isAiEnabled,
  summary,
  isSummarizing,
  playPause,
  skip,
  handleSeek,
  handleVolumeChange,
  handlePlaybackRateChange,
  handleToggleAi,
}) => {
  const isMobile = useIsMobile();
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex h-full flex-col">
      <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="h-full w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="flex h-full flex-col p-4 md:p-6 space-y-4">
            <Card className="flex-grow flex flex-col">
              <CardHeader>
                <CardTitle>Audio Player</CardTitle>
                <CardDescription className="truncate">
                  {audioFile?.name || "No audio loaded"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center items-center space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => skip(-5)}>
                    <Rewind className="h-6 w-6" />
                  </Button>
                  <Button size="icon" className="h-16 w-16 rounded-full" onClick={playPause}>
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => skip(5)}>
                    <FastForward className="h-6 w-6" />
                  </Button>
                </div>
                <div className="w-full space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    onValueChange={(value) => handleSeek(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full pt-4">
                  <VolumeIcon className="h-5 w-5" />
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.05}
                    onValueChange={handleVolumeChange}
                  />
                  <Wind className="h-5 w-5" />
                  <Slider
                    value={[playbackRate]}
                    min={0.5}
                    max={2}
                    step={0.25}
                    onValueChange={handlePlaybackRateChange}
                  />
                  <span className="text-xs font-mono w-10 text-center">{playbackRate.toFixed(2)}x</span>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-grow flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1.5">
                  <CardTitle>AI Summary</CardTitle>
                  <CardDescription>
                    AI-powered summary of your audio.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="ai-switch" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className={cn("h-4 w-4", isAiEnabled && "text-accent")} />
                    <span>AI</span>
                  </Label>
                  <Switch
                    id="ai-switch"
                    checked={isAiEnabled}
                    onCheckedChange={handleToggleAi}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {isSummarizing ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground animate-pulse">
                      Generating summary...
                    </p>
                  </div>
                ) : summary ? (
                  <p className="text-sm">{summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isAiEnabled
                      ? "Summary will appear here after playing and pausing the audio."
                      : "Enable AI to generate a summary."}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="flex h-full flex-col">
            <Card className="h-full flex flex-col border-0 md:border-l rounded-none md:rounded-l-lg">
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription className="truncate">
                  {srtFile?.name || "No transcript loaded"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <TranscriptDisplay
                  subtitles={subtitles}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                />
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AudioPlayer;
