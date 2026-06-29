import { HeartHandshake, DoorOpen, Crown, UtensilsCrossed, Sparkles, Church } from "lucide-react";

const agenda = [
  {
    time: "2:00 a 3:00 PM",
    title: "Recibimiento",
    description: "Recepción de invitados y bienvenida",
    icon: DoorOpen,
  },
  {
    time: "3:15 PM",
    title: "Casamiento",
    description: "Ceremonia de matrimonio",
    icon: Church,
  },
  {
    time: "4:20 PM",
    title: "Felicitaciones",
    description: "Momento de abrazos, fotografías y refrigerio",
    icon: HeartHandshake,
  },
  {
    time: "5:20 PM",
    title: "Entrada de los novios",
    description: "Ingreso y Brindis",
    icon: Crown,
  },
  {
    time: "6:25 PM",
    title: "Cena Formal",
    description: "Compartiremos juntos de una deliciosa cena",
    icon: UtensilsCrossed,
  },
  {
    time: "09:50 PM",
    title: "Cierre y agradecimientos",
    description: "Tiempo para despedirnos",
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