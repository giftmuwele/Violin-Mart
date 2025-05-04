import { useState, useRef } from 'react';
import { Button } from "../components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import React from 'react';
interface AudioPreviewProps {
  audioUrl: string | null;
}

export default function AudioPreview({ audioUrl }: AudioPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      className="outline w-8 h-8 rounded-full"
      onClick={togglePlay}
      title="Preview Sound"
    >
      {isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}
