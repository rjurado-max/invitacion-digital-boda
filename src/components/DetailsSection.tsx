import { Camera, Diamond, Gift } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/constants";

export default function DetailsSection() {
  return (
    <section className="bg-[#fbfaf8] px-6 py-24">
      <div className="mx-auto max-w-[520px]">
        <div className="text-center">
          <div className="mb-8 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#9d7c43]">
            DETALLES IMPORTANTES
          </div>

          <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
            Una experiencia pensada con elegancia
          </h2>

          <p className="mt-8 text-2xl leading-relaxed text-neutral-600">
            Toda la información que tus invitados necesitan, presentada con
            claridad y un diseño premium.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          <article className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
              <Diamond size={34} />
            </div>

            <h3 className="font-serif text-4xl text-[#211b17]">
              Código de vestimenta
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Black Tie / Elegante formal. Se recomiendan tonos neutros, negro,
              champagne, dorado suave o verde olivo.
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
              Tu presencia es el regalo más importante. También puedes visitar
              nuestra mesa de regalos digital.
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
              Hashtag oficial
            </h3>

            <p className="mt-5 text-2xl leading-relaxed text-neutral-600">
              Comparte tus mejores recuerdos usando{" "}
              <strong>{EVENT_CONFIG.hashtag}</strong> en redes sociales.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}