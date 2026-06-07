import { Crown, Flower2, List, Music, Sparkles, Wine } from "lucide-react";

const agenda = [
  {
    time: "5:30 PM",
    title: "Ceremonia religiosa",
    description: "Catedral Santa María del Lago",
    icon: Flower2,
  },
  {
    time: "6:45 PM",
    title: "Cocktail de bienvenida",
    description: "Recepción con música instrumental y bebidas",
    icon: Wine,
  },
  {
    time: "7:30 PM",
    title: "Entrada de los novios",
    description: "Grand Royal Garden Ballroom",
    icon: Crown,
  },
  {
    time: "8:15 PM",
    title: "Cena formal",
    description: "Servicio de tres tiempos",
    icon: List,
  },
  {
    time: "9:30 PM",
    title: "Primer baile",
    description: "Un momento especial para abrir la pista",
    icon: Music,
  },
  {
    time: "10:00 PM",
    title: "Celebración",
    description: "Baile, brindis y recuerdos inolvidables",
    icon: Sparkles,
  },
];

export default function AgendaSection() {
  return (
    <section className="bg-[#12100f] px-6 py-24 text-white">
      <div className="mx-auto max-w-[520px]">
        <div className="text-center">
          <div className="mb-8 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#e8d7ad]">
            AGENDA
          </div>

          <h2 className="font-serif text-5xl leading-tight">
            Programa de celebración
          </h2>

          <p className="mt-8 text-2xl leading-relaxed text-white/70">
            Cada momento fue cuidadosamente organizado para vivir una noche
            impecable.
          </p>
        </div>

        <div className="mt-16 space-y-7">
          {agenda.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={`${item.time}-${item.title}`}
                className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur-md"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[#e8d7ad]">
                  <Icon size={30} />
                </div>

                <p className="font-serif text-4xl font-bold text-[#e8d7ad]">
                  {item.time}
                </p>

                <h3 className="mt-7 font-serif text-4xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-2xl text-white/60">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}