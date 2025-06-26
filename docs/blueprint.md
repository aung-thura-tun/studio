# **App Name**: AudioScribe Sync

## Core Features:

- Audio Player: Allows user to upload and play audio files from local storage. The extension handles file uploads, playing and pausing, skip back/forward.
- Synchronized Transcript: Displays synchronized transcripts from uploaded SRT files. Allows click to seek for time navigation.
- Extension Interface: Provides a popup window with a 'Pop Out' button to open the extension in a separate resizable window. UI is fully responsive, works in both modes.
- Audio State Management: Manages the audio state (playback, volume, speed, time, etc.). Uses local storage to persist user preferences.
- SRT Parsing: Provides SRT parsing utility that converts timestamp formats to seconds.
- Error Handling: Validates uploaded files, and includes loading error handling.
- AI Summary Tool: Summarizes the content of the currently playing audio using generative AI. An AI tool intelligently decides when the audio has reached a logical pausing point, summarizes, and displays the result on the screen, or suggests it using toast notifications. The user should be able to turn the AI summary off and on.

## Style Guidelines:

- Primary color: Slate Blue (#7395AE) for a calm and focused audio experience.
- Background color: Light gray (#F0F4F8), providing a clean backdrop that doesn't distract from the content.
- Accent color: Soft coral (#E07A5F), used sparingly for highlights and interactive elements to draw the eye.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text
- Code font: 'Source Code Pro' for displaying code snippets.
- Uses lucide-react library icons. Clean and modern style.
- The layout will include shadcn/ui components, especially buttons, sliders, scrollable areas and resizable panels.