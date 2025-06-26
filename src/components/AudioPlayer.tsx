"use client";

import React from "react";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Wind,
  Captions,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center items-center space-y-4">
                <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="text-muted-foreground px-2">
                        <Wind className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                        <span className="text-xs font-mono w-8 sm:w-10 text-center">
                          {playbackRate.toFixed(2)}x
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                      <div className="grid gap-4 py-2">
                        <p className="text-sm font-medium leading-none">Playback Speed</p>
                        <Slider
                          value={[playbackRate]}
                          min={0.5}
                          max={2}
                          step={0.25}
                          onValueChange={handlePlaybackRateChange}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button variant="ghost" size="icon" onClick={() => skip(-5)}>
                    <Rewind className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full" onClick={playPause}>
                    {isPlaying ? <Pause className="h-6 w-6 sm:h-7 sm:w-7" /> : <Play className="h-6 w-6 sm:h-7 sm:w-7" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => skip(5)}>
                    <FastForward className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button variant={isTranscriptVisible ? "secondary" : "ghost"} size="icon" onClick={toggleTranscript}>
                    <Captions className="h-4 w-4 sm:h-5 sm:w-5" />
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
              </CardContent>
            </Card>
            <div className="flex-grow min-h-0">
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
