"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ChevronLeft,
  Gift,
  HandHeart,
  HeartHandshake,
  Lock,
  Wallet,
} from "lucide-react";
import { getGifts, getGiftCategories, selectGift, } from "@/actions/gift-actions";
import { EVENT_CONFIG } from "@/lib/constants";

type GiftItem = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  category: string | null;
  selected: boolean;
};

type GiftView =
  | "home"
  | "categories"
  | "list"
  | "reserve"
  | "success"
  | "money";

export default function GiftsSection() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [view, setView] = useState<GiftView>("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGiftId, setSelectedGiftId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [reservedGiftName, setReservedGiftName] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedGift = useMemo(
    () => gifts.find((gift) => gift.id === selectedGiftId),
    [gifts, selectedGiftId]
  );

  const giftsByCategory = useMemo(
    () => gifts.filter((gift) => gift.category === selectedCategory),
    [gifts, selectedCategory]
  );

  const loadGifts = () => {
    startTransition(async () => {
      const [giftResponse, categoryResponse] = await Promise.all([
        getGifts(),
        getGiftCategories(),
      ]);

      setGifts(giftResponse);
      setCategories(categoryResponse);
    });
  };

  useEffect(() => {
    loadGifts();
  }, []);

  const goHome = () => {
    setView("home");
    setSelectedCategory("");
    setSelectedGiftId("");
    setResult("");
  };

  const goCategories = () => {
    setView("categories");
    setSelectedCategory("");
    setSelectedGiftId("");
    setResult("");
  };

  const goGiftList = (category: string) => {
    setSelectedCategory(category);
    setSelectedGiftId("");
    setResult("");
    setView("list");
  };

  const goReserve = (gift: GiftItem) => {
    if (gift.selected) return;

    setSelectedGiftId(gift.id);
    setGuestName("");
    setMessage("");
    setResult("");
    setView("reserve");
  };

  const reserveGift = () => {
    if (!selectedGiftId || !guestName.trim()) return;

    startTransition(async () => {
      const response = await selectGift({
        giftId: selectedGiftId,
        guestName: guestName.trim(),
        phone: "No registrado",
        message,
      });

      setResult(response.message);

      if (response.success) {
        setReservedGiftName(selectedGift?.name ?? "");

        setGuestName("");
        setMessage("");

        loadGifts();

        setView("success");
      }
    });
  };

  return (
    <section id="regalos" className="bg-[#fbfaf8] px-6 py-24">
      <div className="mx-auto max-w-[520px]">
        {view !== "home" && (
          <button
            type="button"
            onClick={view === "list" ? goCategories : goHome}
            className="mb-8 inline-flex items-center gap-2 text-sm font-black tracking-[0.25em] text-[#9d7c43]"
          >
            <ChevronLeft size={18} />
            VOLVER
          </button>
        )}

        {view === "home" && (
          <>
            <div className="text-center">
              <div className="mb-8 inline-flex rounded-full border border-[#e5dac6] bg-[#fbf6ed] px-5 py-3 text-xs font-bold tracking-[0.35em] text-[#9d7c43]">
                MESA DE REGALOS
              </div>

              <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
                Un detalle para nuestro nuevo hogar
              </h2>

              <p className="mt-8 text-xl leading-relaxed text-neutral-600">
                El mejor regalo es tenerlos cerca en este capítulo tan especial
                de nuestra historia. Si desean sumar un detalle a nuestro amor,
                pueden hacerlo con un obsequio de su preferencia.
              </p>
            </div>

            <div className="mt-14 space-y-5">
              <button
                type="button"
                onClick={goCategories}
                className="flex w-full items-center gap-5 rounded-[2rem] border border-[#eadfce] bg-white p-8 text-left shadow-sm transition hover:border-black"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fbf6ed] text-[#9d7c43]">
                  <Gift size={30} />
                </div>

                <div>
                  <h3 className="font-serif text-3xl text-[#211b17]">
                    Elige un regalo
                  </h3>
                  <p className="mt-2 text-lg text-neutral-600">
                    Selecciona un detalle especial para los novios.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setView("money")}
                className="flex w-full items-center gap-5 rounded-[2rem] border border-[#eadfce] bg-white p-8 text-left shadow-sm transition hover:border-black"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fbf6ed] text-[#9d7c43]">
                  <Wallet size={30} />
                </div>

                <div>
                  <h3 className="font-serif text-3xl text-[#211b17]">
                    Regalo económico
                  </h3>
                  <p className="mt-2 text-lg text-neutral-600">
                    También puedes realizar una colaboración económica.
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {view === "categories" && (
          <>
            <div className="text-center">
              <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
                Regalos por categorías
              </h2>
            </div>

            <div className="mt-12 space-y-4">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => goGiftList(category)}
                  className="w-full rounded-2xl border border-[#eadfce] bg-white px-6 py-5 text-center text-lg font-semibold text-[#211b17] shadow-sm transition hover:border-black"
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}

        {view === "list" && (
          <>
            <div className="text-center">
              <h2
                className="
                  mx-auto
                  max-w-md
                  font-serif
                  text-4xl
                  sm:text-5xl
                  leading-tight
                  break-words
                  text-[#211b17]
                "
              >
                {selectedCategory}
              </h2>
            </div>

            <div className="mt-12 max-h-[720px] space-y-5 overflow-y-auto pr-1">
              {giftsByCategory.length === 0 && (
                <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 text-center text-lg text-neutral-600 shadow-sm">
                  No hay regalos disponibles en esta categoría.
                </div>
              )}

              {giftsByCategory.map((gift) => (
                <button
                  key={gift.id}
                  type="button"
                  disabled={gift.selected}
                  onClick={() => goReserve(gift)}
                  className={`w-full overflow-hidden rounded-[2rem] border text-left shadow-sm transition ${
                    gift.selected
                      ? "border-[#eadfce] bg-white opacity-45"
                      : "border-[#eadfce] bg-white hover:border-black"
                  }`}
                >
                  {gift.imageUrl ? (
                    <div className="flex h-56 w-full items-center justify-center bg-[#fbf6ed] px-4 py-4">
                      <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 w-full items-center justify-center bg-[#fbf6ed] text-[#9d7c43]">
                      <Gift size={48} />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="font-serif text-3xl text-[#211b17]">
                      {gift.name}
                    </h3>

                    <div className="mt-4 flex items-center gap-2 text-sm font-black tracking-[0.25em] text-[#9d7c43]">
                      {gift.selected ? (
                        <>
                          <Lock size={16} />
                          RESERVADO
                        </>
                      ) : (
                        <>
                          <HeartHandshake size={16} />
                          DISPONIBLE
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {view === "reserve" && selectedGift && (
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-4xl text-[#211b17]">
              Reservar regalo
            </h2>

            <div className="mt-6 rounded-2xl bg-[#fbf6ed] p-5">
              <p className="text-sm font-black tracking-[0.25em] text-[#9d7c43]">
                REGALO SELECCIONADO
              </p>
              <p className="mt-2 font-serif text-3xl text-[#211b17]">
                {selectedGift.name}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Tu nombre completo"
                className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 text-lg outline-none"
              />

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Mensaje opcional"
                rows={4}
                className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 text-lg outline-none"
              />

              <button
                type="button"
                onClick={reserveGift}
                disabled={isPending || !guestName.trim()}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-5 text-sm font-black tracking-[0.25em] text-white disabled:cursor-not-allowed disabled:opacity-50"
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
        )}

        {view === "success" && (
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fbf6ed]">
              <HeartHandshake
                size={40}
                className="text-[#9d7c43]"
              />
            </div>

            <h2 className="mt-6 font-serif text-4xl text-[#211b17]">
              ¡Gracias por tu detalle!
            </h2>

            <p className="mt-6 text-lg text-neutral-600">
              Has reservado:
            </p>

            <p className="mt-3 font-serif text-3xl text-[#211b17]">
              {reservedGiftName}
            </p>

            <p className="mt-8 text-lg leading-relaxed text-neutral-600">
              Nos ayudará mucho en nuestro nuevo hogar y
              nos llena de alegría compartir este momento
              tan especial contigo.
            </p>

            <div className="mt-8 text-4xl">
              ❤️
            </div>

            <button
              type="button"
              onClick={goHome}
              className="mt-10 rounded-full bg-black px-8 py-4 text-sm font-black tracking-[0.25em] text-white"
            >
              VOLVER AL INICIO
            </button>
          </div>
        )}

        {view === "money" && (
          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            <h2 className="font-serif text-4xl text-[#211b17]">
              Regalo económico
            </h2>

            <div className="mt-8 space-y-5 text-lg text-neutral-600">
              <p>
                Puedes Yapear al
                <br />
                <strong className="text-[#211b17]">
                  {EVENT_CONFIG.bank.yapeNumber}
                </strong>
              </p>

              <p>
                O transferir a
                <br />
                Cuenta: {EVENT_CONFIG.bank.accountNumber}
              </p>

              <p>CCI: {EVENT_CONFIG.bank.cci}</p>

              <p>Titular: {EVENT_CONFIG.bank.holder}</p>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 text-2xl font-semibold text-[#211b17]">
              <HandHeart className="text-[#9d7c43]" size={28} />
              Estamos muy agradecidos
            </div>
          </div>
        )}
      </div>
    </section>
  );
}