"use client";

import React from "react";
import type { Track } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Music4, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistProps {
  tracks: Track[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
}

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const date = new Date(0);
    date.setSeconds(seconds);
    try {
      return date.toISOString().substr(14, 5);
    } catch (e) {
      return "00:00";
    }
};

const Playlist: React.FC<PlaylistProps> = ({ tracks, currentTrackIndex, onSelectTrack }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Playlist</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-2 pr-4 space-y-1">
            {tracks.map((track, index) => (
              <Button
                key={track.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-2 text-left",
                  index === currentTrackIndex && "bg-primary/20"
                )}
                onClick={() => onSelectTrack(index)}
              >
                <div className="flex items-center gap-4 w-full">
                    {index === currentTrackIndex ? <Play className="h-5 w-5 text-accent flex-shrink-0" /> : <Music4 className="h-5 w-5 flex-shrink-0" />}
                    <div className="flex-grow overflow-hidden">
                        <p className="truncate font-semibold">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.audioFile.name}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground flex-shrink-0">{formatTime(track.duration)}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Playlist;
