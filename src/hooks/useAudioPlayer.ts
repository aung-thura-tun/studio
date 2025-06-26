"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { parseSrt } from "@/lib/srt";
import type { Subtitle, Track } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const useAudioPlayer = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(true);

  const { toast } = useToast();

  const selectTrack = useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
    }
  }, [tracks.length]);

  useEffect(() => {
    const track = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;
    if (audioRef.current && track) {
        audioRef.current.src = track.audioSrc;
        audioRef.current.load();
        audioRef.current.play().catch(e => console.error("Autoplay was prevented", e));
        setIsPlaying(true);
        setCurrentTime(0);
    }
  }, [currentTrackIndex, tracks, audioRef]);


  useEffect(() => {
    const storedRate = localStorage.getItem("audio_rate");
    if (storedRate) setPlaybackRate(parseFloat(storedRate));
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const audioFiles = Array.from(files).filter(f => f.type.startsWith("audio/"));
    const srtFiles = Array.from(files).filter(f => f.name.endsWith(".srt"));
    
    if (audioFiles.length === 0) {
        toast({
            variant: "destructive",
            title: "No Audio Files",
            description: "Please upload at least one audio file.",
        });
        return;
    }

    const srtMap = new Map<string, File>();
    for (const srtFile of srtFiles) {
        const nameWithoutExt = srtFile.name.replace(/\.[^/.]+$/, "");
        srtMap.set(nameWithoutExt, srtFile);
    }

    const newTracks: Track[] = await Promise.all(
      audioFiles.map(async (audioFile) => {
        const nameWithoutExt = audioFile.name.replace(/\.[^/.]+$/, "");
        const srtFile = srtMap.get(nameWithoutExt) || null;
        let subtitles: Subtitle[] = [];

        if (srtFile) {
            try {
                const srtText = await srtFile.text();
                const parsedSubtitles = parseSrt(srtText);
                if (parsedSubtitles.length === 0 && srtText.trim() !== "") {
                    throw new Error("Invalid SRT format.");
                }
                subtitles = parsedSubtitles;
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "SRT Parse Error",
                    description: `Could not parse ${srtFile.name}.`,
                });
            }
        }
        
        const audioSrc = URL.createObjectURL(audioFile);
        const duration = await new Promise<number>(resolve => {
            const tempAudio = document.createElement('audio');
            tempAudio.onloadedmetadata = () => {
                resolve(tempAudio.duration);
                URL.revokeObjectURL(audioSrc); // Clean up
            };
            tempAudio.onerror = () => {
                resolve(0); // Could not load
                URL.revokeObjectURL(audioSrc); // Clean up
            }
            tempAudio.src = audioSrc;
        });

        return {
            id: uuidv4(),
            audioFile,
            srtFile,
            audioSrc: URL.createObjectURL(audioFile), // Create a new one as the previous was revoked
            subtitles,
            title: nameWithoutExt,
            duration
        };
      })
    );

    const wasEmpty = tracks.length === 0;
    setTracks(prev => [...prev, ...newTracks]);
    if (wasEmpty && newTracks.length > 0) {
      setCurrentTrackIndex(0);
    }
  };

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
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

  const toggleTranscript = () => setIsTranscriptVisible(prev => !prev);
  
  // Audio element event handlers
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.playbackRate = playbackRate;
    }
  };

  const onEnded = () => {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
        setIsPlaying(false);
    }
  };

  const onPlay = () => setIsPlaying(true);

  const onPause = () => setIsPlaying(false);
  
  const onError = () => {
      toast({
          variant: "destructive",
          title: "Audio Error",
          description: "There was an error playing the audio file.",
      })
      setIsPlaying(false);
  }

  return {
    // State
    tracks,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isTranscriptVisible,
    // Handlers
    handleFileUpload,
    selectTrack,
    playPause,
    skip,
    handleSeek,
    handlePlaybackRateChange,
    toggleTranscript,
    // Audio event handlers
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
    onPlay,
    onPause,
    onError,
  };
};
