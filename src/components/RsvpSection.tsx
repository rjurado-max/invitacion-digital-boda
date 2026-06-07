"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, Heart } from "lucide-react";
import { submitRsvp } from "@/actions/rsvp-actions";

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
};

export default function RsvpSection({ guest = null }: Props) {
  const [form, setForm] = useState({
    fullName: guest?.full_name ?? "",
    phone: guest?.phone ?? "",
    attendance: "SI" as "SI" | "NO",
    companions: "0",
    message: "",
  });

  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (guest) {
      setForm((current) => ({
        ...current,
        fullName: guest.full_name,
        phone: guest.phone ?? "",
      }));
    }
  }, [guest]);

  const updateField = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await submitRsvp({
        guestId: guest?.id ?? null,
        fullName: form.fullName,
        phone: form.phone,
        attendance: form.attendance,
        companions: Number(form.companions),
        message: form.message,
      });

      setResult(response.message);

      if (response.success) {
        setForm({
          fullName: guest?.full_name ?? "",
          phone: guest?.phone ?? "",
          attendance: "SI",
          companions: "0",
          message: "",
        });
      }
    });
  };

  return (
    <section
      id="rsvp"
      className="relative overflow-hidden bg-black px-6 py-24 text-white"
    >
      <div className="absolute inset-0 bg-[url('/images/rsvp.jpg')] bg-cover bg-center opacity-45" />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto max-w-[520px] text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#e8d7ad]">
          <Heart size={34} />
        </div>

        <h2 className="font-serif text-5xl leading-tight">
          Nos encantará celebrar contigo
        </h2>

        {guest && (
          <p className="mt-5 text-xl text-[#e8d7ad]">
            Confirmación personalizada para {guest.full_name}
          </p>
        )}

        <p className="mt-8 text-2xl leading-relaxed text-white/80">
          Confirma tu asistencia y acompáñanos en una noche diseñada para
          celebrar el amor.
        </p>

        <form
          onSubmit={submitForm}
          className="mt-12 space-y-5 rounded-[2rem] border border-white/15 bg-white/10 p-6 text-left backdrop-blur-md"
        >
          <input
            name="fullName"
            value={form.fullName}
            onChange={updateField}
            required
            readOnly={Boolean(guest)}
            placeholder="Nombre completo"
            className="w-full rounded-2xl bg-white px-5 py-4 text-lg text-black outline-none read-only:bg-white/90"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="Celular"
            className="w-full rounded-2xl bg-white px-5 py-4 text-lg text-black outline-none"
          />

          <select
            name="attendance"
            value={form.attendance}
            onChange={updateField}
            className="w-full rounded-2xl bg-white px-5 py-4 text-lg text-black outline-none"
          >
            <option value="SI">Sí asistiré</option>
            <option value="NO">No podré asistir</option>
          </select>

          <input
            name="companions"
            value={form.companions}
            onChange={updateField}
            type="number"
            min="0"
            max={guest?.max_companions ?? undefined}
            placeholder="Cantidad de acompañantes"
            className="w-full rounded-2xl bg-white px-5 py-4 text-lg text-black outline-none"
          />

          {guest && (
            <p className="text-center text-sm text-white/70">
              Puedes registrar hasta {guest.max_companions} acompañante(s).
            </p>
          )}

          <textarea
            name="message"
            value={form.message}
            onChange={updateField}
            placeholder="Mensaje para los novios"
            rows={4}
            className="w-full rounded-2xl bg-white px-5 py-4 text-lg text-black outline-none"
          />

          <button
            disabled={isPending}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-5 text-sm font-black tracking-[0.25em] text-black disabled:opacity-60"
          >
            <CheckCircle2 size={22} />
            {isPending ? "REGISTRANDO..." : "CONFIRMAR RSVP"}
          </button>
        </form>

        {result && (
          <div className="mt-8 rounded-[1.5rem] bg-white p-6 text-xl font-bold text-black">
            {result}
          </div>
        )}
      </div>
    </section>
  );
}