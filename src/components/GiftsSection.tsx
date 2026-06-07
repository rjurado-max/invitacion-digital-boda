"use client";

import { useEffect, useState, useTransition } from "react";
import { Gift, HeartHandshake } from "lucide-react";
import { getGifts, selectGift } from "@/actions/gift-actions";
import { EVENT_CONFIG } from "@/lib/constants";

type GiftItem = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  selected: boolean;
};

export default function GiftsSection() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [selectedGiftId, setSelectedGiftId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadGifts = () => {
    startTransition(async () => {
      const response = await getGifts();
      setGifts(response);
    });
  };

  useEffect(() => {
    loadGifts();
  }, []);

  const reserveGift = () => {
    if (!selectedGiftId) {
      setResult("Selecciona un regalo disponible.");
      return;
    }

    startTransition(async () => {
      const response = await selectGift({
        giftId: selectedGiftId,
        guestName,
        phone,
        message,
      });

      setResult(response.message);

      if (response.success) {
        setSelectedGiftId("");
        setGuestName("");
        setPhone("");
        setMessage("");
        loadGifts();
      }
    });
  };

  return (
    <section id="regalos" className="bg-[#fbfaf8] px-6 py-24">
      <div className="mx-auto max-w-[520px]">
        <div className="text-center">
          <div className="mb-8 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#9d7c43]">
            MESA DE REGALOS
          </div>

          <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
            Un detalle para nuestro nuevo hogar
          </h2>

          <p className="mt-8 text-2xl leading-relaxed text-neutral-600">
            Puedes seleccionar un regalo disponible o realizar una colaboración económica.
          </p>
        </div>

        <div className="mt-14 space-y-5">
          {gifts.map((gift) => (
            <button
              key={gift.id}
              disabled={gift.selected}
              onClick={() => setSelectedGiftId(gift.id)}
              className={`w-full rounded-[2rem] border p-6 text-left shadow-sm transition ${
                selectedGiftId === gift.id
                  ? "border-black bg-white"
                  : "border-[#eadfce] bg-white"
              } ${gift.selected ? "opacity-45" : ""}`}
            >
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fbf6ed] text-[#9d7c43]">
                  <Gift size={30} />
                </div>

                <div>
                  <h3 className="font-serif text-3xl text-[#211b17]">
                    {gift.name}
                  </h3>

                  <p className="mt-2 text-lg text-neutral-600">
                    {gift.description}
                  </p>

                  <p className="mt-3 text-sm font-black tracking-[0.25em] text-[#9d7c43]">
                    {gift.selected
                      ? "YA RESERVADO"
                      : gift.price
                        ? `S/ ${gift.price}`
                        : "APORTE LIBRE"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <h3 className="font-serif text-3xl text-[#211b17]">
            Reservar regalo
          </h3>

          <div className="mt-6 space-y-4">
            <input
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              placeholder="Tu nombre completo"
              className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 text-lg outline-none"
            />

            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Celular"
              className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 text-lg outline-none"
            />

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Mensaje opcional"
              rows={3}
              className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 text-lg outline-none"
            />

            <button
              onClick={reserveGift}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-5 text-sm font-black tracking-[0.25em] text-white disabled:opacity-60"
            >
              <HeartHandshake size={22} />
              {isPending ? "REGISTRANDO..." : "RESERVAR REGALO"}
            </button>
          </div>

          {result && (
            <div className="mt-6 rounded-2xl bg-[#fbf6ed] p-5 text-center text-lg text-neutral-700">
              {result}
            </div>
          )}
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
          <h3 className="font-serif text-3xl text-[#211b17]">
            Colaboración económica
          </h3>

          <p className="mt-4 text-lg text-neutral-600">
            Yape: {EVENT_CONFIG.bank.yapeNumber}
          </p>

          <p className="mt-2 text-lg text-neutral-600">
            Cuenta: {EVENT_CONFIG.bank.accountNumber}
          </p>

          <p className="mt-2 text-lg text-neutral-600">
            CCI: {EVENT_CONFIG.bank.cci}
          </p>

          <p className="mt-2 text-lg text-neutral-600">
            Titular: {EVENT_CONFIG.bank.holder}
          </p>
        </div>
      </div>
    </section>
  );
}