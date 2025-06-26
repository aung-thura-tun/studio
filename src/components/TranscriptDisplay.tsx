"use client";

import React, { useEffect, useRef } from "react";
import type { Subtitle } from "@/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptDisplayProps {
  subtitles: Subtitle[];
  currentTime: number;
  onSeek: (time: number) => void;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  subtitles,
  currentTime,
  onSeek,
}) => {
  const activeSubtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (activeSubtitleRef.current) {
      activeSubtitleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime]); // Simplified dependency to only trigger on time change, which implies active sub changed

  if (subtitles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Transcript will appear here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 pr-6 space-y-4">
        {subtitles.map((subtitle) => {
          const isActive =
            currentTime >= subtitle.start && currentTime <= subtitle.end;

          return (
            <p
              key={subtitle.id}
              ref={isActive ? activeSubtitleRef : null}
              onClick={() => onSeek(subtitle.start)}
              className={cn(
                "cursor-pointer rounded-md p-2 transition-colors duration-200",
                isActive
                  ? "bg-primary/30 text-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <span
                className={cn(
                  "font-semibold text-accent mr-2 font-code",
                  isActive ? "text-accent" : "text-muted-foreground/50"
                )}
              >
                {new Date(subtitle.start * 1000).toISOString().substr(14, 5)}
              </span>
              {subtitle.text}
            </p>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default TranscriptDisplay;
