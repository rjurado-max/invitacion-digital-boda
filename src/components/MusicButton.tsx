"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EVENT_CONFIG } from "@/lib/constants";

export default function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio();

    audio.src = EVENT_CONFIG.music.src;
    audio.loop = true;
    audio.volume = 0.45;

    audioRef.current = audio;

    const startMusic = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    startMusic();

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-8 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-black text-[#e8d7ad] shadow-2xl"
      aria-label="Controlar música"
    >
      {playing ? <Pause size={28} /> : <Play size={28} />}
    </button>
  );
}