import { CalendarDays, Clock, Wine } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/constants";

export default function EventSummary() {
  return (
    <section className="bg-[#111] px-6 py-14">
      <div className="mx-auto max-w-[500px] rounded-[1.75rem] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-md">
        <div className="space-y-4">
          <div className="rounded-[1.35rem] bg-white/10 p-5">
            <CalendarDays size={22} className="mb-3 text-[#e8d7ad]" />
            <p className="text-lg font-bold leading-snug">Sábado 05 de Septiembre, 2026</p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 p-6">
            <Clock size={22} className="mb-3 text-[#e8d7ad]" />
            <p className="text-lg font-bold leading-snug">
              Ceremonia {EVENT_CONFIG.ceremony.time}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 p-6">
            <Wine size={22} className="mb-3 text-[#e8d7ad]" />
            <p className="text-lg font-bold leading-snug">
              Recepción {EVENT_CONFIG.reception.time}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}