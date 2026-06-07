"use client";

import { motion } from "framer-motion";
import { EVENT_CONFIG } from "@/lib/constants";

type Props = {
  onOpen: () => void;
};

export default function OpeningEnvelope({ onOpen }: Props) {
  return (
    <section className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050504] px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-[390px] text-center"
      >
        <button onClick={onOpen} className="group w-full">
          <div className="relative mx-auto mb-14 h-48 w-full rounded-sm bg-[#efe4cb] shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(150deg,transparent_49%,rgba(0,0,0,0.08)_50%,transparent_51%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_49%,rgba(0,0,0,0.08)_50%,transparent_51%)]" />

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#8d1525] text-[#e8d7ad] shadow-xl"
            >
              <span className="text-lg tracking-[0.3em]">{EVENT_CONFIG.initials}</span>
              <span className="mt-2 text-xs tracking-[0.25em]">{EVENT_CONFIG.year}</span>
            </motion.div>
          </div>

          <h1 className="font-serif text-3xl tracking-[0.2em] text-[#c7ad7e]">
            {EVENT_CONFIG.coupleNames}
          </h1>

          <p className="mt-8 text-xs tracking-[0.5em] text-[#5f5444]">
            TOCA PARA ABRIR
          </p>
        </button>
      </motion.div>
    </section>
  );
}