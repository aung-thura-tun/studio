"use client";

import React, { useRef } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AudioPlayer from "@/components/AudioPlayer";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
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
    toggleTranscript,
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
  } = useAudioPlayer(audioRef);

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  return (
    <main className="container mx-auto p-4 h-screen max-h-screen">
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        className="hidden"
      />
      {tracks.length > 0 && currentTrack && currentTrackIndex !== null ? (
        <AudioPlayer
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          selectTrack={selectTrack}
          subtitles={currentTrack.subtitles}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          playPause={playPause}
          skip={skip}
          handleSeek={handleSeek}
          handlePlaybackRateChange={handlePlaybackRateChange}
          isTranscriptVisible={isTranscriptVisible}
          toggleTranscript={toggleTranscript}
        />
      ) : (
        <FileUpload handleFileUpload={handleFileUpload} />
      )}
    </main>
  );
}
