"use client";

import {
  Camera,
  CheckSquare,
  Clock,
  Diamond,
  Gift,
  Heart,
  ParkingCircleIcon,
  PhoneOff,
} from "lucide-react";
import { EVENT_CONFIG } from "@/lib/constants";

type Props = {
  onOpenRsvp?: () => void;
};

export default function DetailsSection({ onOpenRsvp }: Props) {
  const openRsvp = () => {
    if (onOpenRsvp) {
      onOpenRsvp();
      return;
    }

    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#fbfaf8] px-6 py-24">
      <div className="mx-auto max-w-[520px]">
        <div className="text-center">
          <div className="mb-8 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#9d7c43]">
            DETALLES IMPORTANTES
          </div>

          <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
            Antes de acompañarnos
          </h2>

          <p className="mt-8 text-2xl leading-relaxed text-neutral-600">
            Hemos preparado esta información para que disfrutes la celebración.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <CheckSquare size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Confirmar asistencia
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Agradecemos confirmar tu asistencia antes del 15 de Julio.
            </p>

            <button
              type="button"
              onClick={openRsvp}
              className="mt-7 inline-block text-sm font-black tracking-[0.35em] text-[#9d7c43] underline underline-offset-8"
            >
              CONFIRMAR
            </button>
          </article>

          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <Clock size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">Puntualidad</h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              La ceremonia iniciará puntualmente. Te recomendamos llegar con anticipación.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <Diamond size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Código de vestimenta
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Vestimenta formal elegante. Agradecemos a las damas evitar el blanco y tonalidades similares al vestido de la novia, y a los caballeros evitar el color beige.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <PhoneOff size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Silencia y disfruta
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Durante la ceremonia te invitamos a vivir este momento con nosotros, dejando los teléfonos en silencio o vibración.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <Gift size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Mesa de regalos
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Tu presencia es el regalo más importante. También puedes visitar nuestra mesa de regalos digital.
            </p>

            <a
              href="#regalos"
              className="mt-7 inline-block text-sm font-black tracking-[0.35em] text-[#9d7c43] underline underline-offset-8"
            >
              VER REGALOS
            </a>
          </article>

          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <Camera size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Comparte tus recuerdos
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Usa <strong>{EVENT_CONFIG.hashtag}</strong> para compartir tus fotografías y momentos favoritos.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <Heart size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Celebración para adultos
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Queremos a tus pequeños, sin embargo este evento está destinado solo para adultos. Esperamos tu comprensión.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <ParkingCircleIcon size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Estacionamiento
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              El lugar cuenta con estacionamiento para mayor comodidad de nuestros invitados.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}