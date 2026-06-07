import { MapPin } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/constants";

export default function LocationSection() {
  return (
    <section id="ubicacion" className="bg-[#fbfaf8] px-6 py-24">
      <div className="mx-auto max-w-[520px]">
        <div className="text-center">
          <div className="mb-8 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#9d7c43]">
            UBICACIÓN
          </div>

          <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
            Ceremonia y recepción
          </h2>

          <p className="mt-8 text-2xl leading-relaxed text-neutral-600">
            Botones directos a mapas para facilitar la llegada de cada invitado.
          </p>
        </div>

        <div className="mt-16 space-y-10">
          <article className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-[#fbf6ed] shadow-sm">
            <img
              src="/images/ceremony.jpg"
              alt="Lugar de ceremonia"
              className="h-[330px] w-full object-cover"
            />

            <div className="p-8">
              <span className="inline-flex rounded-full bg-white px-6 py-3 text-xs font-black tracking-[0.35em] text-[#9d7c43]">
                CEREMONIA
              </span>

              <h3 className="mt-8 font-serif text-5xl leading-tight text-[#211b17]">
                {EVENT_CONFIG.ceremony.title}
              </h3>

              <p className="mt-5 text-2xl text-neutral-600">
                {EVENT_CONFIG.ceremony.address}
              </p>

              <a
                href={EVENT_CONFIG.ceremony.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-black px-8 py-5 text-sm font-black tracking-[0.3em] text-white shadow-xl"
              >
                <MapPin size={22} />
                MAPA CEREMONIA
              </a>
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-[#fbf6ed] shadow-sm">
            <img
              src="/images/reception.jpg"
              alt="Lugar de recepción"
              className="h-[330px] w-full object-cover"
            />

            <div className="p-8">
              <span className="inline-flex rounded-full bg-white px-6 py-3 text-xs font-black tracking-[0.35em] text-[#9d7c43]">
                RECEPCIÓN
              </span>

              <h3 className="mt-8 font-serif text-5xl leading-tight text-[#211b17]">
                {EVENT_CONFIG.reception.title}
              </h3>

              <p className="mt-5 text-2xl text-neutral-600">
                {EVENT_CONFIG.reception.address}
              </p>

              <a
                href={EVENT_CONFIG.reception.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-black px-8 py-5 text-sm font-black tracking-[0.3em] text-white shadow-xl"
              >
                <MapPin size={22} />
                MAPA RECEPCIÓN
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}