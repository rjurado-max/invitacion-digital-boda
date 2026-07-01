"use client";

import { useState, useTransition } from "react";
import { findGuestTable } from "@/actions/guest-actions";
import { EVENT_CONFIG } from "@/lib/constants";

type Props = {
  defaultGuestName?: string;
  tableNumber?: string | null;
};

export default function TableFinder({
  defaultGuestName = "",
  tableNumber,
}: Props) {
  const [name, setName] = useState(defaultGuestName);
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const searchTable = () => {
    startTransition(async () => {
      const response = await findGuestTable(name);
      setResult(response.message);
    });
  };

  return (
    <section id="mi-mesa" className="bg-white px-6 py-18">
      <div className="mx-auto max-w-[500px] text-center">
        <div className="mb-7 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-2.5 text-[10px] font-bold tracking-[0.32em] text-[#9d7c43]">
          MAPA DE MESAS
        </div>

        <h2 className="font-serif text-4xl leading-tight text-[#211b17] sm:text-5xl">
          ¿Cuál es mi mesa?
        </h2>

        <p className="mt-7 text-xl leading-relaxed text-neutral-600 sm:text-2xl">
          Escribe tu nombre y encuentra dónde estarás sentado esta noche.
        </p>

        {tableNumber && (
  <div className="mt-7 rounded-[1.35rem] border border-[#eadfce] bg-[#fbf6ed] p-5 text-center">
    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#9d7c43]">
      Mesa asignada
    </p>

    <p className="mt-3 font-serif text-4xl text-[#211b17]">
      {tableNumber}
    </p>
  </div>
)}

        {EVENT_CONFIG.tableFinderEnabled ? (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Escribe tu nombre completo..."
              className="w-full rounded-[1.25rem] border border-[#eadfce] bg-[#fbf6ed] px-5 py-4 text-base outline-none"
            />

            <button
              onClick={searchTable}
              disabled={isPending}
              className="rounded-[1.25rem] bg-black px-7 py-4 text-xs font-black tracking-[0.22em] text-white disabled:opacity-50"
            >
              {isPending ? "BUSCANDO" : "BUSCAR"}
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-[1.5rem] border border-[#eadfce] bg-[#fbf6ed] p-6">
            <p className="text-lg font-medium leading-relaxed text-[#211b17]">
              La distribución de mesas estará disponible próximamente.
            </p>

            <p className="mt-3 text-base leading-relaxed text-neutral-600">
              Estamos organizando cada detalle para brindarte la mejor experiencia.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-7 rounded-[1.35rem] border border-[#eadfce] bg-[#fbf6ed] p-5 text-lg leading-relaxed text-neutral-700">
            {result}
          </div>
        )}
      </div>
    </section>
  );
}