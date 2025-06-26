"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { parseSrt } from "@/lib/srt";
import type { Subtitle } from "@/types";

export const useAudioPlayer = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const { toast } = useToast();

  useEffect(() => {
    const storedRate = localStorage.getItem("audio_rate");
    if (storedRate) setPlaybackRate(parseFloat(storedRate));

    if (audioRef.current) {
      audioRef.current.volume = 1;
    }
  }, [audioRef]);

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

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
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
  
  const handlePlaybackRateChange = (value: number[]) => {
    const newRate = value[0];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
    localStorage.setItem("audio_rate", newRate.toString());
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
      audioRef.current.volume = 1;
    }
  };

  const onEnded = () => setIsPlaying(false);

  const onPlay = () => setIsPlaying(true);

  const onPause = () => {
    setIsPlaying(false);
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
    playbackRate,
    // Handlers
    handleAudioUpload,
    handleSrtUpload,
    playPause,
    skip,
    handleSeek,
    handlePlaybackRateChange,
    // Audio event handlers
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
    onPlay,
    onPause,
    onError,
  };
};
