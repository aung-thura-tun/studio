"use client";

import React from "react";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Wind,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import type { Subtitle, Track } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import Playlist from "./Playlist";

interface AudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  selectTrack: (index: number) => void;
  subtitles: Subtitle[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  playPause: () => void;
  skip: (seconds: number) => void;
  handleSeek: (time: number) => void;
  handlePlaybackRateChange: (value: number[]) => void;
  isTranscriptVisible: boolean;
  toggleTranscript: () => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "00:00:00";
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  currentTrackIndex,
  selectTrack,
  subtitles,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  playPause,
  skip,
  handleSeek,
  handlePlaybackRateChange,
  isTranscriptVisible,
  toggleTranscript,
}) => {
  const isMobile = useIsMobile();
  const currentTrack = tracks[currentTrackIndex];

  const transcriptPanel = (
    <div className="flex h-full flex-col">
      <Card className="h-full flex flex-col border-0 md:border-l rounded-none md:rounded-l-lg">
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
          <CardDescription className="truncate">
            {currentTrack.srtFile?.name || "No transcript loaded"}
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
  );

  return (
    <div className="flex h-full flex-col">
      <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="h-full w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={isTranscriptVisible ? 45 : 100} minSize={30}>
          <div className="flex h-full flex-col p-4 md:p-6 space-y-4">
            <Card className="flex-shrink-0 flex flex-col">
               <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Now Playing</CardTitle>
                        <CardDescription className="truncate">
                            {currentTrack.title || "No audio loaded"}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleTranscript}>
                        {isTranscriptVisible ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                    </Button>
                </div>
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
            <div className="h-full flex-grow overflow-auto">
              <Playlist tracks={tracks} currentTrackIndex={currentTrackIndex} onSelectTrack={selectTrack} />
            </div>
          </div>
        </ResizablePanel>
        {isTranscriptVisible && <ResizableHandle withHandle />}
        {isTranscriptVisible && 
          <ResizablePanel defaultSize={55} minSize={30}>
            {transcriptPanel}
          </ResizablePanel>
        }
      </ResizablePanelGroup>
    </div>
  );
};

export default AudioPlayer;
