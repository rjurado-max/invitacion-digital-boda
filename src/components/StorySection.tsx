export default function StorySection() {
  return (
    <section className="bg-[#f7f1e8] px-6 py-20">
      <div className="mx-auto max-w-[520px]">
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-[#e8dcc8] bg-white p-2">
          <img
            src="/images/couple.jpg"
            alt="Fotografía de los novios"
            className="h-[560px] w-full rounded-[1.6rem] object-cover"
          />
        </div>

        <div className="mb-8 inline-flex rounded-full border border-[#e5dac6] bg-white px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#9d7c43]">
          NUESTRA HISTORIA
        </div>

        <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
          Dos vidas, una promesa eterna.
        </h2>

        <p className="mt-8 text-2xl leading-relaxed text-neutral-600">
          Celebramos el inicio de una nueva etapa rodeados de las personas que
          han sido parte de nuestro camino. Esta noche será una experiencia
          íntima, elegante y llena de detalles diseñados para recordarse siempre.
        </p>

        <div className="mt-12 space-y-6">
          <div className="rounded-[1.8rem] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            <p className="font-serif text-5xl font-bold">2</p>
            <p className="mt-2 text-sm font-black tracking-[0.3em] text-[#9d7c43]">
              AÑOS DE HISTORIA
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            <p className="font-serif text-5xl font-bold">1</p>
            <p className="mt-2 text-sm font-black tracking-[0.3em] text-[#9d7c43]">
              GRAN PROMESA
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            <p className="font-serif text-5xl font-bold">∞</p>
            <p className="mt-2 text-sm font-black tracking-[0.3em] text-[#9d7c43]">
              PARA SIEMPRE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}