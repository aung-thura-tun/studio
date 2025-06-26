"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { parseSrt } from "@/lib/srt";
import type { Subtitle } from "@/types";
import { summarizeAudioContent } from "@/ai/flows/summarize-audio";
import { toggleAISummary } from "@/ai/flows/toggle-ai-summary";

export const useAudioPlayer = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const lastSummarizedTimeRef = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    const storedVolume = localStorage.getItem("audio_volume");
    if (storedVolume) setVolume(parseFloat(storedVolume));

    const storedRate = localStorage.getItem("audio_rate");
    if (storedRate) setPlaybackRate(parseFloat(storedRate));

    const storedAiEnabled = localStorage.getItem("ai_summary_enabled");
    if (storedAiEnabled) setIsAiEnabled(JSON.parse(storedAiEnabled));
  }, []);

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setAudioSrc(URL.createObjectURL(file));
      // Reset state for new audio
      setCurrentTime(0);
      setDuration(0);
      setSubtitles([]);
      setSrtFile(null);
      setSummary("");
      lastSummarizedTimeRef.current = 0;
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a valid audio file.",
      });
    }
  };

  const handleSrtUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".srt")) {
      setSrtFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const parsedSubtitles = parseSrt(content);
          if (parsedSubtitles.length === 0 && content.trim() !== "") {
              throw new Error("Invalid SRT format.");
          }
          setSubtitles(parsedSubtitles);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "SRT Parsing Error",
                description: "Could not parse SRT file. Please check the format.",
            });
        }
      };
      reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the SRT file.",
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a valid SRT file.",
      });
    }
  };

  const handleGenerateSummary = useCallback(async () => {
    if (!isAiEnabled || !audioRef.current || isSummarizing) return;

    const currentAudioTime = audioRef.current.currentTime;
    // Generate summary if more than 60 seconds of new content has been played
    if (currentAudioTime - lastSummarizedTimeRef.current > 60) {
      setIsSummarizing(true);
      const newTranscript = subtitles
        .filter(
          (s) =>
            s.start > lastSummarizedTimeRef.current && s.start <= currentAudioTime
        )
        .map((s) => s.text)
        .join(" ");

      if (newTranscript.trim().length === 0) {
        setIsSummarizing(false);
        return;
      }

      try {
        toast({
          title: "Generating AI Summary...",
          description: "Please wait a moment.",
        });
        const result = await summarizeAudioContent({
          audioTranscript: newTranscript,
          currentSummary: summary,
        });
        setSummary(result.summary);
        lastSummarizedTimeRef.current = currentAudioTime;
      } catch (error) {
        console.error("Failed to generate summary", error);
        toast({
          variant: "destructive",
          title: "AI Summary Failed",
          description: "Could not generate summary.",
        });
      } finally {
        setIsSummarizing(false);
      }
    }
  }, [isAiEnabled, isSummarizing, subtitles, summary, toast, audioRef]);

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        handleGenerateSummary();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    localStorage.setItem("audio_volume", newVolume.toString());
  };
  
  const handlePlaybackRateChange = (value: number[]) => {
    const newRate = value[0];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
    localStorage.setItem("audio_rate", newRate.toString());
  };

  const handleToggleAi = async (enabled: boolean) => {
    setIsAiEnabled(enabled);
    localStorage.setItem("ai_summary_enabled", JSON.stringify(enabled));
    try {
      await toggleAISummary(enabled);
      toast({
        title: `AI Summary ${enabled ? "Enabled" : "Disabled"}`,
        description: `Summaries will ${
          enabled ? "" : "not"
        } be generated automatically.`,
      });
    } catch (error) {
      console.error("Failed to toggle AI summary:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not update AI summary preference.",
      });
    }
  };
  
  // Audio element event handlers
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => setIsPlaying(false);

  const onPlay = () => setIsPlaying(true);

  const onPause = () => {
    setIsPlaying(false);
    handleGenerateSummary();
  };
  
  const onError = () => {
      toast({
          variant: "destructive",
          title: "Audio Error",
          description: "There was an error loading the audio file.",
      })
      setAudioSrc(null);
      setAudioFile(null);
  }

  return {
    // State
    audioFile,
    srtFile,
    audioSrc,
    subtitles,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isAiEnabled,
    summary,
    isSummarizing,
    // Handlers
    handleAudioUpload,
    handleSrtUpload,
    playPause,
    skip,
    handleSeek,
    handleVolumeChange,
    handlePlaybackRateChange,
    handleToggleAi,
    // Audio event handlers
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
    onPlay,
    onPause,
    onError,
  };
};
