import type { Subtitle } from '@/types';

// Converts SRT timestamp (HH:MM:SS,mmm) to seconds
function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(':');
  if (parts.length !== 3) return 0;
  
  const secondsAndMillis = parts[2].split(',');
  if (secondsAndMillis.length !== 2) return 0;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(secondsAndMillis[0], 10);
  const milliseconds = parseInt(secondsAndMillis[1], 10);
  
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
    return 0;
  }

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

// Parses SRT file content into an array of Subtitle objects
export function parseSrt(data: string): Subtitle[] {
  // Normalize line endings
  const normalizedData = data.replace(/\r\n/g, '\n');

  // Regex to match SRT blocks.
  const srtRegex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]+?)(?=\n\n|$)/g;
  
  const subtitles: Subtitle[] = [];
  let match;

  while ((match = srtRegex.exec(normalizedData)) !== null) {
    subtitles.push({
      id: parseInt(match[1], 10),
      start: timestampToSeconds(match[2]),
      end: timestampToSeconds(match[3]),
      text: match[4].trim(),
    });
  }

  return subtitles;
}
