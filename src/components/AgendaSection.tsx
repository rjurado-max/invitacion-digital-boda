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
    <section className="bg-[#12100f] px-6 py-18 text-white">
      <div className="mx-auto max-w-[500px]">
        <div className="text-center">
          <div className="mb-7 inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-[10px] font-bold tracking-[0.32em] text-[#e8d7ad]">
            AGENDA
          </div>

          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
            Programa de celebración
          </h2>

          <p className="mt-7 text-xl leading-relaxed text-white/70 sm:text-2xl">
            Cada momento fue cuidadosamente organizado para vivir una noche
            impecable.
          </p>
        </div>

        <div className="mt-12 space-y-5">
          {agenda.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={`${item.time}-${item.title}`}
                className="rounded-[1.6rem] border border-white/10 bg-white/10 p-6 backdrop-blur-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[#e8d7ad]">
                  <Icon size={25} />
                </div>

                <p className="font-serif text-3xl font-bold text-[#e8d7ad]">
                  {item.time}
                </p>

                <h3 className="mt-5 font-serif text-3xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-xl leading-relaxed text-white/60">
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