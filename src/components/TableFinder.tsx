"use client";

import { useState, useTransition } from "react";
import { findGuestTable } from "@/actions/guest-actions";

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
    <section id="mi-mesa" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[520px] text-center">
        <div className="mb-8 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#9d7c43]">
          MAPA DE MESAS
        </div>

        <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
          ¿Cuál es mi mesa?
        </h2>

        <p className="mt-8 text-2xl leading-relaxed text-neutral-600">
          Escribe tu nombre y encuentra dónde estarás sentado esta noche.
        </p>

        {tableNumber && (
  <div className="mt-8 rounded-[1.5rem] border border-[#eadfce] bg-[#fbf6ed] p-6 text-center">
    <p className="text-sm uppercase tracking-[0.3em] text-[#9d7c43]">
      Mesa asignada
    </p>

    <p className="mt-3 font-serif text-5xl text-[#211b17]">
      {tableNumber}
    </p>
  </div>
)}

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Escribe tu nombre completo..."
            className="w-full rounded-[1.4rem] border border-[#eadfce] bg-[#fbf6ed] px-6 py-5 text-lg outline-none"
          />

          <button
            onClick={searchTable}
            disabled={isPending}
            className="rounded-[1.4rem] bg-black px-8 py-5 text-sm font-black tracking-[0.25em] text-white disabled:opacity-50"
          >
            {isPending ? "BUSCANDO" : "BUSCAR"}
          </button>
        </div>

        {result && (
          <div className="mt-8 rounded-[1.5rem] border border-[#eadfce] bg-[#fbf6ed] p-6 text-xl text-neutral-700">
            {result}
          </div>
        )}
      </div>
    </section>
  );
}