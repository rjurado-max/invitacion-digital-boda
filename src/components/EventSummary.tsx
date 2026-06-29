import { CalendarDays, Clock, Wine } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/constants";

export default function EventSummary() {
  return (
    <section className="bg-[#111] px-6 pt-16 pb-16">
      <div className="mx-auto max-w-[520px] rounded-[2rem] border border-white/15 bg-white/10 p-6 text-white backdrop-blur-md">
        <div className="space-y-5">
          <div className="rounded-[1.5rem] bg-white/10 p-6">
            <CalendarDays className="mb-4 text-[#e8d7ad]" />
            <p className="text-xl font-bold">Sábado 05 de Septiembre, 2026</p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 p-6">
            <Clock className="mb-4 text-[#e8d7ad]" />
            <p className="text-xl font-bold">
              Ceremonia {EVENT_CONFIG.ceremony.time}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 p-6">
            <Wine className="mb-4 text-[#e8d7ad]" />
            <p className="text-xl font-bold">
              Recepción {EVENT_CONFIG.reception.time}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}