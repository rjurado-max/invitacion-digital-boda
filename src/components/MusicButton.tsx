"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EVENT_CONFIG } from "@/lib/constants";

export default function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(EVENT_CONFIG.music.src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.45;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    await audioRef.current.play();
    setPlaying(true);
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