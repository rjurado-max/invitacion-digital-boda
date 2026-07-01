"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, ChevronDown, Heart } from "lucide-react";
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

const MAX_FULL_NAME_LENGTH = 40;

export default function RsvpSection({ guest = null }: Props) {
  const [form, setForm] = useState({
    fullName: guest?.full_name ?? "",
    phone: guest?.phone ?? "",
    attendance: "SI" as "SI" | "NO",
    companions: "0",
    message: "",
  });

  const [result, setResult] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showAttendanceOptions, setShowAttendanceOptions] =
    useState(false);
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

    const cleanFullName = form.fullName.trim().replace(/\s+/g, " ");
    const nameParts = cleanFullName.split(" ");

    setFullNameError("");
    setPhoneError("");
    setResult("");

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(cleanFullName)) {
      setFullNameError(
        "Ingresa solo letras. No se permiten números ni caracteres especiales."
      );
      return;
    }

    if (nameParts.length < 2) {
      setFullNameError("Ingresa al menos un nombre y un apellido.");
      return;
    }

    if (cleanFullName.length > MAX_FULL_NAME_LENGTH) {
      setFullNameError(
        `El nombre no debe superar los ${MAX_FULL_NAME_LENGTH} caracteres.`
      );
      return;
    }

    if (!/^9\d{8}$/.test(form.phone)) {
      setPhoneError("Ingresa un celular válido de 9 dígitos que empiece con 9.");
      return;
    }

    startTransition(async () => {
      const response = await submitRsvp({
        guestId: guest?.id ?? null,
        fullName: cleanFullName,
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
      className="relative overflow-hidden bg-black px-6 py-18 text-white"
    >
      <div className="absolute inset-0 bg-[url('/images/rsvp.jpg')] bg-cover bg-center opacity-45" />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto max-w-[500px] text-center">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#e8d7ad]">
          <Heart size={28} />
        </div>

        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
          Nos encantará celebrar contigo
        </h2>

        {guest && (
          <p className="mt-4 text-lg text-[#e8d7ad]">
            Confirmación personalizada para {guest.full_name}
          </p>
        )}

        <p className="mt-7 text-xl leading-relaxed text-white/80 sm:text-2xl">
          Confirma tu asistencia y acompáñanos en una noche diseñada para
          celebrar el amor.
        </p>

        <form
          onSubmit={submitForm}
          className="mt-10 space-y-4 rounded-[1.6rem] border border-white/10 bg-white/10 p-5 text-left backdrop-blur-md"
        >
          <input
            name="fullName"
            value={form.fullName}
            onChange={(event) => {
              const value = event.target.value
                .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "")
                .slice(0, MAX_FULL_NAME_LENGTH);

              setForm({
                ...form,
                fullName: value,
              });

              setFullNameError("");
            }}
            required
            maxLength={MAX_FULL_NAME_LENGTH}
            readOnly={Boolean(guest)}
            placeholder="Nombre completo"
            className={`w-full rounded-[1.35rem] bg-white px-5 py-3.5 text-base text-black outline-none transition read-only:bg-white/90 ${
              fullNameError
                ? "border-2 border-red-500"
                : "border-2 border-transparent"
            }`}
          />

          {fullNameError && (
            <p className="px-2 text-sm font-medium text-red-400">
              {fullNameError}
            </p>
          )}

          <input
            name="phone"
            value={form.phone}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "");

              if (value.length <= 9) {
                setForm({
                  ...form,
                  phone: value,
                });

                setPhoneError("");
              }
            }}
            placeholder="Celular"
            inputMode="numeric"
            maxLength={9}
            className={`w-full rounded-[1.35rem] bg-white px-5 py-3.5 text-base text-black outline-none transition ${
              phoneError
                ? "border-2 border-red-500"
                : "border-2 border-transparent"
            }`}
          />

          {phoneError && (
            <p className="px-2 text-sm font-medium text-red-400">
              {phoneError}
            </p>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowAttendanceOptions(!showAttendanceOptions)
              }
              className="flex w-full items-center justify-between rounded-[1.35rem] bg-white px-5 py-3.5 text-left text-base text-black outline-none"
            >
              <span>
                {form.attendance === "SI"
                  ? "Sí asistiré"
                  : "No podré asistir"}
              </span>

              <ChevronDown
                size={22}
                className={`text-[#9d7c43] transition ${
                  showAttendanceOptions ? "rotate-180" : ""
                }`}
              />
            </button>

            {showAttendanceOptions && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[1.35rem] border border-white/20 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, attendance: "SI" });
                    setShowAttendanceOptions(false);
                  }}
                  className={`w-full px-5 py-3.5 text-left text-base transition ${
                    form.attendance === "SI"
                      ? "bg-[#fbf6ed] font-semibold text-[#9d7c43]"
                      : "text-black hover:bg-[#fbf6ed]"
                  }`}
                >
                  Sí asistiré
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, attendance: "NO" });
                    setShowAttendanceOptions(false);
                  }}
                  className={`w-full px-5 py-3.5 text-left text-base transition ${
                    form.attendance === "NO"
                      ? "bg-[#fbf6ed] font-semibold text-[#9d7c43]"
                      : "text-black hover:bg-[#fbf6ed]"
                  }`}
                >
                  No podré asistir
                </button>
              </div>
            )}
          </div>

          <textarea
            name="message"
            value={form.message}
            onChange={updateField}
            placeholder="Mensaje para los novios"
            rows={4}
            className="w-full rounded-[1.35rem] bg-white px-5 py-3.5 text-base text-black outline-none"
          />

          <button
            disabled={isPending}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-xs font-black tracking-[0.22em] text-black disabled:opacity-60"
          >
            <CheckCircle2 size={20} />
            {isPending ? "REGISTRANDO..." : "CONFIRMAR RSVP"}
          </button>
        </form>

        {result && (
          <div className="mt-7 rounded-[1.35rem] bg-white p-5 text-lg font-bold text-black">
            {result}
          </div>
        )}
      </div>
    </section>
  );
}