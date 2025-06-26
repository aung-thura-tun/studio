export interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface Track {
  id: string;
  audioFile: File;
  srtFile: File | null;
  audioSrc: string;
  subtitles: Subtitle[];
  title: string;
  duration: number;
}
