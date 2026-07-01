"use client";

import { useEffect, useState } from "react";
import { EVENT_CONFIG } from "@/lib/constants";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(): TimeLeft {
  const target = new Date(EVENT_CONFIG.eventDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const items = [
    { label: "DÍAS", value: timeLeft.days },
    { label: "HORAS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEG", value: timeLeft.seconds },
  ];

  return (
    <section className="bg-[#111] px-6 pb-16">
      <div className="mx-auto grid max-w-[500px] grid-cols-4 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 text-center text-white backdrop-blur-md">
        {items.map((item) => (
          <div key={item.label} className="border-r border-white/10 px-2 py-5 last:border-r-0">
            <p className="font-serif text-3xl font-bold leading-none">{item.value}</p>
            <p className="mt-2 text-[10px] font-bold tracking-[0.28em] text-[#e8d7ad]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}