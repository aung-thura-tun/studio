"use client";

import React, { useRef } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AudioPlayer from "@/components/AudioPlayer";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
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
  } = useAudioPlayer(audioRef);

  return (
    <main className="container mx-auto p-4 h-screen max-h-screen">
      <audio
        ref={audioRef}
        src={audioSrc || ""}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        className="hidden"
      />
      {audioSrc && subtitles.length > 0 ? (
        <AudioPlayer
          audioFile={audioFile}
          srtFile={srtFile}
          subtitles={subtitles}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          playbackRate={playbackRate}
          isAiEnabled={isAiEnabled}
          summary={summary}
          isSummarizing={isSummarizing}
          playPause={playPause}
          skip={skip}
          handleSeek={handleSeek}
          handleVolumeChange={handleVolumeChange}
          handlePlaybackRateChange={handlePlaybackRateChange}
          handleToggleAi={handleToggleAi}
        />
      ) : (
        <FileUpload
          audioFile={audioFile}
          srtFile={srtFile}
          handleAudioUpload={handleAudioUpload}
          handleSrtUpload={handleSrtUpload}
        />
      )}
    </main>
  );
}
