"use client";

import { X } from "lucide-react";
import RsvpSection from "@/components/RsvpSection";

type Guest = {
  id: string;
  full_name: string;
  phone: string | null;
  table_number: string | null;
  max_companions: number;
  token: string;
  access_code: string | null;
  invitation_group: string | null;
};

type Props = {
  guest?: Guest | null;
  onClose: () => void;
};

export default function RsvpModal({ guest = null, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/75 px-4 py-6 backdrop-blur-sm">
      <div className="relative mx-auto flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[2rem] bg-black shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar confirmación"
          className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-md"
        >
          <X size={24} />
        </button>

        <div className="overflow-y-auto">
          <RsvpSection guest={guest} />
        </div>
      </div>
    </div>
  );
}