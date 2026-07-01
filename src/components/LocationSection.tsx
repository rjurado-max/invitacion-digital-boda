import { MapPin } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/constants";

export default function LocationSection() {
  return (
    <section id="ubicacion" className="bg-[#fbfaf8] px-6 py-18">
      <div className="mx-auto max-w-[500px]">
        <div className="text-center">
          <div className="mb-7 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-2.5 text-[10px] font-bold tracking-[0.32em] text-[#9d7c43]">
            UBICACIÓN
          </div>

          <h2 className="font-serif text-4xl leading-tight text-[#211b17] sm:text-5xl">
            Ceremonia y recepción
          </h2>

          <p className="mt-7 text-xl leading-relaxed text-neutral-600 sm:text-2xl">
            Aquí celebraremos juntos este hermoso momento.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          <article className="overflow-hidden rounded-[1.6rem] border border-[#eadfce] bg-[#fbf6ed] shadow-sm">
            <img
              src="/images/reception.jpg"
              alt="Ceremonia y recepción"
              className="h-[300px] w-full object-cover"
            />

            <div className="p-6">
              <span className="inline-flex rounded-full bg-white px-5 py-2.5 text-[10px] font-black tracking-[0.30em] text-[#9d7c43]">
                CELEBRACIÓN
              </span>

              <h3 className="mt-6 font-serif text-4xl leading-tight text-[#211b17]">
                {EVENT_CONFIG.reception.title}
              </h3>

              <p className="mt-4 text-xl leading-relaxed text-neutral-600">
                {EVENT_CONFIG.reception.address}
              </p>

              <a
                href={EVENT_CONFIG.reception.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-black tracking-[0.25em] text-white shadow-lg"
              >
                <MapPin size={22} />
                VER MAPA
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}