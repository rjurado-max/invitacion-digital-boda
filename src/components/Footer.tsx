import { EVENT_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#080808] px-6 py-14 text-center text-white">
      <div className="mx-auto max-w-[500px]">
        <p className="text-base leading-relaxed text-white/40">
          {EVENT_CONFIG.coupleNames} · Sábado 05 de Septiembre, 2026 ·{" "}
          {EVENT_CONFIG.hashtag}
        </p>

        <h2 className="mt-8 font-serif text-3xl leading-relaxed tracking-[0.18em] text-white/80">
          Unidos por Su gracia, Guiados por Su amor
        </h2>

        <p className="mt-3 text-[10px] tracking-[0.28em] text-white/35">
          Colosenses 3:14
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://www.facebook.com/frances.veraramirez.5?locale=es_LA"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/50 transition hover:border-[#e8d7ad] hover:text-[#e8d7ad]"
          >
            Facebook
          </a>

          <a
            href="https://wa.me/51918707082"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/50 transition hover:border-[#e8d7ad] hover:text-[#e8d7ad]"
          >
            WhatsApp
          </a>

          <a
            href="tel:918707082"
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/50 transition hover:border-[#e8d7ad] hover:text-[#e8d7ad]"
          >
            918 707 082
          </a>
        </div>
      </div>
    </footer>
  );
}