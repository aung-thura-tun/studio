"use client";

import React, { useRef } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AudioPlayer from "@/components/AudioPlayer";
import FileUpload from "@/components/FileUpload";
import { Input } from "@/components/ui/input";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    previousTrack,
    nextTrack,
    toggleTranscript,
    playPause,
    skip,
    handleSeek,
    handlePlaybackRateChange,
    clearPlaylist,
    // Audio event handlers
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
    onPlay,
    onPause,
    onError,
  } = useAudioPlayer(audioRef);

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  const triggerFileSelect = () => fileInputRef.current?.click();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files);
    // Reset file input to allow uploading the same file(s) again
    if (event.target) {
        event.target.value = '';
    }
  };


  return (
    <main className="container mx-auto p-4 h-screen max-h-screen">
      <audio
        ref={audioRef}
        src={currentTrack?.audioSrc || null}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        className="hidden"
      />
       <Input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept="audio/*,.srt"
        className="hidden"
        onChange={onFileChange}
        multiple
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
          previousTrack={previousTrack}
          nextTrack={nextTrack}
          onAddFiles={triggerFileSelect}
          onClearPlaylist={clearPlaylist}
        />
      ) : (
        <FileUpload />
      )}
    </main>
  );
}
