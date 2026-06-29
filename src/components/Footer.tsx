import { EVENT_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#080808] px-6 py-16 text-center text-white">
      <div className="mx-auto max-w-[520px]">
        <p className="text-lg text-white/40">
          {EVENT_CONFIG.coupleNames} · Sábado 05 de Septiembre, 2026 ·{" "}
          {EVENT_CONFIG.hashtag}
        </p>

        <h2 className="mt-10 font-serif text-4xl tracking-[0.3em] text-white/80">
          Unidos por Su gracia, Guiados por Su amor
        </h2>

        <p className="mt-4 text-xs tracking-[0.35em] text-white/35">
          Colosenses 3:14
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="https://www.facebook.com/frances.veraramirez.5?locale=es_LA"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-7 py-3 text-white/50"
          >
            Facebook
          </a>

          <a
            href="https://wa.me/51918707082"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-7 py-3 text-white/50"
          >
            WhatsApp
          </a>

          <a
            href="tel:918707082"
            className="rounded-full border border-white/15 px-7 py-3 text-white/50"
          >
            918 707 082
          </a>
        </div>
      </div>
    </footer>
  );
}