"use client";

import { MapPin, Heart } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/constants";

type Props = {
  guestName?: string;
  onOpenRsvp?: () => void;
};

export default function HeroSection({ guestName, onOpenRsvp }: Props) {
  const goToRsvp = () => {
    if (onOpenRsvp) {
      onOpenRsvp();
      return;
    }

    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToLocation = () => {
    document.getElementById("ubicacion")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-6 pb-16 pt-32 text-white">
      <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-[center_38%] opacity-65 md:bg-[center_42%]" />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto max-w-[500px]">
        <div className="mb-9 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-bold tracking-[0.32em] text-[#e8d7ad]">
          CELEBRAMOS NUESTRA BODA
        </div>

        <h1 className="font-serif text-5xl leading-[0.95] sm:text-6xl">
          {EVENT_CONFIG.brideName} &<br />
          {EVENT_CONFIG.groomName}
        </h1>

        {guestName && (
          <p className="mt-6 text-xl text-[#e8d7ad]">
            Invitación especial para {guestName}
          </p>
        )}

        <p className="mt-7 text-xl leading-relaxed text-white/85 sm:text-2xl">
          Dos historias, un mismo destino. Dios unió nuestros caminos en Su perfecto tiempo y, con gratitud en nuestros corazones, te invitamos a acompañarnos en esta nueva etapa de nuestras vidas.
        </p>

        <div className="mt-9 space-y-4">
          <button
            type="button"
            onClick={goToRsvp}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-5 text-sm font-black tracking-[0.25em] text-black"
          >
            <Heart
              size={22}
              className="shrink-0"
            />

            <span className="whitespace-nowrap">
              CONFIRMAR ASISTENCIA
            </span>
          </button>

          <button
            type="button"
            onClick={goToLocation}
            className="flex w-[68%] items-center justify-center gap-3 rounded-full bg-white/35 px-6 py-5 text-sm font-black tracking-[0.25em] text-white"
          >
            <MapPin size={22} className="shrink-0" />
            VER UBICACIÓN
          </button>
        </div>
      </div>
    </section>
  );
}