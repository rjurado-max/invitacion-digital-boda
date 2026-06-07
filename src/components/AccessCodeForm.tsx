"use client";

import { useState, useTransition } from "react";
import { LockKeyhole } from "lucide-react";
import { validateGuestAccess } from "@/actions/guest-actions";

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
  token: string;
  onSuccess: (guest: Guest) => void;
};

export default function AccessCodeForm({ token, onSuccess }: Props) {
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const validateAccess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await validateGuestAccess(token, accessCode);

      if (!response.success || !response.guest) {
        setMessage(response.message);
        return;
      }

      onSuccess(response.guest);
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050504] px-6 text-center text-white">
      <form
        onSubmit={validateAccess}
        className="w-full max-w-[420px] rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur-md"
      >
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white text-black">
          <LockKeyhole size={34} />
        </div>

        <h1 className="font-serif text-4xl">Código de acceso</h1>

        <p className="mt-5 text-white/70">
          Ingresa el código recibido para abrir tu invitación personalizada.
        </p>

        <input
          value={accessCode}
          onChange={(event) => setAccessCode(event.target.value)}
          placeholder="Ejemplo: 1234"
          className="mt-8 w-full rounded-2xl bg-white px-5 py-4 text-center text-2xl tracking-[0.4em] text-black outline-none"
        />

        <button
          disabled={isPending}
          className="mt-6 w-full rounded-full bg-white px-6 py-5 text-sm font-black tracking-[0.3em] text-black disabled:opacity-60"
        >
          {isPending ? "VALIDANDO..." : "ABRIR INVITACIÓN"}
        </button>

        {message && (
          <div className="mt-6 rounded-2xl bg-white p-4 text-black">
            {message}
          </div>
        )}
      </form>
    </main>
  );
}