"use client";

import { EVENT_CONFIG } from "@/lib/constants";

export default function FloatingHeader() {
  const goToTable = () => {
    document.getElementById("mi-mesa")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed left-0 right-0 top-4 z-50 mx-auto w-[92%] max-w-[520px]">
      <div className="flex items-center justify-between rounded-full bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm tracking-[0.25em] text-[#e8d7ad]">
          {EVENT_CONFIG.initials}
        </div>

        <button
          onClick={goToTable}
          className="rounded-full bg-black px-7 py-4 text-sm font-bold tracking-[0.25em] text-white shadow-lg"
        >
          MI MESA
        </button>
      </div>
    </header>
  );
}