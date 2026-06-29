"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EVENT_CONFIG } from "@/lib/constants";

type Props = {
  onOpen: () => void;
};

const sparkles = [
  { top: "4%", left: "5%", size: 1, delay: 0 },
  { top: "6%", left: "12%", size: 2, delay: 1.2 },
  { top: "8%", left: "18%", size: 1, delay: 2.7 },
  { top: "5%", left: "27%", size: 2, delay: 4.1 },
  { top: "7%", left: "36%", size: 1, delay: 0.8 },
  { top: "4%", left: "45%", size: 2, delay: 2.3 },
  { top: "9%", left: "53%", size: 1, delay: 3.8 },
  { top: "6%", left: "62%", size: 2, delay: 1.4 },
  { top: "8%", left: "70%", size: 1, delay: 5.2 },
  { top: "5%", left: "79%", size: 3, delay: 2.8 },
  { top: "7%", left: "88%", size: 1, delay: 4.6 },

  { top: "14%", left: "8%", size: 2, delay: 1.1 },
  { top: "17%", left: "21%", size: 1, delay: 3.3 },
  { top: "12%", left: "31%", size: 2, delay: 0.6 },
  { top: "16%", left: "42%", size: 1, delay: 5.5 },
  { top: "13%", left: "56%", size: 2, delay: 2.2 },
  { top: "18%", left: "67%", size: 1, delay: 4.9 },
  { top: "15%", left: "78%", size: 2, delay: 1.7 },
  { top: "12%", left: "90%", size: 1, delay: 3.5 },

  { top: "24%", left: "6%", size: 2, delay: 2.5 },
  { top: "28%", left: "16%", size: 1, delay: 4.8 },
  { top: "22%", left: "28%", size: 2, delay: 1.9 },
  { top: "26%", left: "38%", size: 1, delay: 3.7 },
  { top: "23%", left: "49%", size: 2, delay: 5.4 },
  { top: "29%", left: "61%", size: 1, delay: 0.9 },
  { top: "25%", left: "72%", size: 2, delay: 2.8 },
  { top: "21%", left: "84%", size: 1, delay: 4.3 },

  { top: "34%", left: "10%", size: 1, delay: 1.5 },
  { top: "38%", left: "22%", size: 2, delay: 5.1 },
  { top: "32%", left: "33%", size: 1, delay: 3.2 },
  { top: "36%", left: "44%", size: 2, delay: 0.4 },
  { top: "39%", left: "55%", size: 1, delay: 2.7 },
  { top: "35%", left: "66%", size: 2, delay: 4.4 },
  { top: "31%", left: "77%", size: 1, delay: 1.8 },
  { top: "37%", left: "89%", size: 2, delay: 5.8 },

  { top: "46%", left: "7%", size: 2, delay: 0.7 },
  { top: "49%", left: "19%", size: 1, delay: 3.6 },
  { top: "44%", left: "29%", size: 2, delay: 5.3 },
  { top: "48%", left: "41%", size: 1, delay: 2.1 },
  { top: "43%", left: "53%", size: 3, delay: 4.7 },
  { top: "47%", left: "64%", size: 1, delay: 1.2 },
  { top: "45%", left: "75%", size: 2, delay: 3.9 },
  { top: "49%", left: "87%", size: 1, delay: 5.6 },

  { top: "58%", left: "5%", size: 2, delay: 1.6 },
  { top: "63%", left: "17%", size: 1, delay: 4.1 },
  { top: "56%", left: "30%", size: 2, delay: 0.5 },
  { top: "61%", left: "42%", size: 1, delay: 2.9 },
  { top: "59%", left: "55%", size: 2, delay: 5.7 },
  { top: "64%", left: "68%", size: 1, delay: 1.3 },
  { top: "57%", left: "81%", size: 3, delay: 4.5 },

  { top: "72%", left: "9%", size: 1, delay: 3.4 },
  { top: "76%", left: "23%", size: 2, delay: 0.8 },
  { top: "69%", left: "36%", size: 1, delay: 5.2 },
  { top: "74%", left: "49%", size: 2, delay: 2.6 },
  { top: "78%", left: "61%", size: 1, delay: 4.8 },
  { top: "71%", left: "74%", size: 2, delay: 1.7 },
  { top: "75%", left: "88%", size: 1, delay: 3.1 },

  { top: "84%", left: "6%", size: 2, delay: 5.4 },
  { top: "88%", left: "20%", size: 1, delay: 1.9 },
  { top: "82%", left: "34%", size: 2, delay: 4.2 },
  { top: "87%", left: "47%", size: 1, delay: 0.6 },
  { top: "91%", left: "60%", size: 2, delay: 3.8 },
  { top: "85%", left: "73%", size: 1, delay: 5.9 },
  { top: "89%", left: "87%", size: 2, delay: 2.4 }
];

export default function OpeningEnvelope({ onOpen }: Props) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;

    setIsOpening(true);

    setTimeout(() => {
      onOpen();
    }, 900);
  };
  return (
    <motion.section
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpening ? 0 : 1 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050504] px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,86,38,0.18),transparent_45%)]" />

      <div className="absolute inset-0">
        {sparkles.map((sparkle, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-[#f8df9f]"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: [0, 0.25, 1, 0.35, 0],
              scale: [0.3, 0.8, 1.4, 0.75, 0.3],
              boxShadow: [
                "0 0 0 rgba(248,223,159,0)",
                "0 0 6px rgba(248,223,159,0.35)",
                "0 0 18px rgba(248,223,159,0.8)",
                "0 0 8px rgba(248,223,159,0.35)",
                "0 0 0 rgba(248,223,159,0)",
              ],
            }}
            transition={{
              duration: 4.5 + (index % 6) * 0.45,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.06 : 1,
          y: isOpening ? -24 : 0,
        }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-[390px] text-center"
      >
        <button onClick={handleOpen} disabled={isOpening} className="group w-full">
          <div className="relative mx-auto mb-14 h-48 w-full rounded-sm bg-[#efe4cb] shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(150deg,transparent_49%,rgba(0,0,0,0.08)_50%,transparent_51%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_49%,rgba(0,0,0,0.08)_50%,transparent_51%)]" />

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-[#e8d2a6] shadow-[0_10px_26px_rgba(65,18,20,0.28)] ring-1 ring-[#c3a66a]/25"
              style={{
                background:
                  "radial-gradient(circle at 38% 30%, #9b2430 0%, #841824 42%, #68131d 78%, #4d0f17 100%)",
              }}
            >
              <div className="flex w-full flex-col items-center justify-center text-center">
                <div className="grid w-[58px] grid-cols-[1fr_auto_1fr] items-center">
                  <span className="text-right font-serif text-[22px] leading-none text-[#f1e2bd]">
                    {EVENT_CONFIG.initials.split("·")[0].trim()}
                  </span>

                  <span className="px-2 text-center font-serif text-[18px] leading-none text-[#f1e2bd]">
                    ·
                  </span>

                  <span className="text-left font-serif text-[22px] leading-none text-[#f1e2bd]">
                    {EVENT_CONFIG.initials.split("·")[1].trim()}
                  </span>
                </div>

                <span className="my-2 h-px w-10 bg-[#bfa678]/35" />

                <div className="flex items-center justify-center gap-2">
                  <span className="h-[4px] w-[4px] rotate-45 bg-[#bfa678]/45" />

                  <span className="text-[10px] leading-none tracking-[0.18em] text-[#c9b184]/70">
                    {EVENT_CONFIG.year}
                  </span>

                  <span className="h-[4px] w-[4px] rotate-45 bg-[#bfa678]/45" />
                </div>
              </div>
            </motion.div>
          </div>

          <h1 className="font-serif text-3xl tracking-[0.2em] text-[#c7ad7e]">
            {EVENT_CONFIG.coupleNames}
          </h1>

          <motion.div
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-8 flex items-center justify-center gap-4 text-xs tracking-[0.5em] text-[#8f7a53]"
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-[#bfa678]" />

            <span>TOCA PARA ABRIR</span>

            <span className="h-1.5 w-1.5 rotate-45 bg-[#bfa678]" />
          </motion.div>
        </button>
      </motion.div>

      <style jsx>{`
        @keyframes sparkleTwinkle {
          0% {
            opacity: 0;
            transform: scale(0.35);
            box-shadow: 0 0 0 rgba(248, 223, 159, 0);
          }

          18% {
            opacity: 0;
            transform: scale(0.35);
            box-shadow: 0 0 0 rgba(248, 223, 159, 0);
          }

          38% {
            opacity: 0.45;
            transform: scale(0.8);
            box-shadow: 0 0 7px rgba(248, 223, 159, 0.45);
          }

          52% {
            opacity: 1;
            transform: scale(1.35);
            box-shadow:
              0 0 8px rgba(248, 223, 159, 0.9),
              0 0 18px rgba(248, 223, 159, 0.55),
              0 0 28px rgba(248, 223, 159, 0.25);
          }

          68% {
            opacity: 0.35;
            transform: scale(0.75);
            box-shadow: 0 0 7px rgba(248, 223, 159, 0.35);
          }

          100% {
            opacity: 0;
            transform: scale(0.35);
            box-shadow: 0 0 0 rgba(248, 223, 159, 0);
          }
        }
      `}</style>
    </motion.section>
  );
}