export default function StorySection() {
  return (
    <section className="bg-[#f7f1e8] px-6 py-16">
      <div className="mx-auto max-w-[500px]">
        <div className="mb-9 overflow-hidden rounded-[1.75rem] border border-[#e8dcc8] bg-white p-2">
          <img
            src="/images/couple.jpg"
            alt="Fotografía de los novios"
            className="h-[560px] w-full rounded-[1.6rem] object-cover"
          />
        </div>

        <div className="mb-7 inline-flex rounded-full border border-[#e5dac6] bg-white px-5 py-2.5 text-[10px] font-bold tracking-[0.32em] text-[#9d7c43]">
          NUESTRA HISTORIA
        </div>

        <h2 className="font-serif text-4xl leading-tight text-[#211b17] sm:text-5xl">
          Dos vidas, una promesa eterna.
        </h2>

        <p className="mt-7 text-xl leading-relaxed text-neutral-600 sm:text-2xl">
          Celebramos el inicio de una nueva etapa rodeados de las personas que
          han sido parte de nuestro camino. Esta noche será una experiencia
          íntima, elegante y llena de detalles diseñados para recordarse siempre.
        </p>

        <div className="mt-10 space-y-4">
          <div className="rounded-[1.6rem] border border-[#eadfce] bg-white p-6 text-center shadow-sm">
            <p className="font-serif text-4xl font-bold leading-none">2</p>
            <p className="mt-3 text-[11px] font-black tracking-[0.26em] text-[#9d7c43]">
              AÑOS DE HISTORIA
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-[#eadfce] bg-white p-6 text-center shadow-sm">
            <p className="font-serif text-4xl font-bold leading-none">1</p>
            <p className="mt-3 text-[11px] font-black tracking-[0.26em] text-[#9d7c43]">
              GRAN PROMESA
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-[#eadfce] bg-white p-6 text-center shadow-sm">
            <p className="font-serif text-4xl font-bold leading-none">∞</p>
            <p className="mt-3 text-[11px] font-black tracking-[0.26em] text-[#9d7c43]">
              PARA SIEMPRE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}