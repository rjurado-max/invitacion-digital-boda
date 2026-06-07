"use server";

import { supabase } from "@/lib/supabase";

export async function getGifts() {
  const { data: gifts, error: giftsError } = await supabase
    .from("gifts")
    .select("id, name, description, price, image_url")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (giftsError || !gifts) {
    return [];
  }

  const { data: selections } = await supabase
    .from("gift_selections")
    .select("gift_id");

  const selectedGiftIds = new Set(
    (selections ?? []).map((selection) => selection.gift_id)
  );

  return gifts.map((gift) => ({
    id: gift.id,
    name: gift.name,
    description: gift.description,
    price: gift.price,
    imageUrl: gift.image_url,
    selected: selectedGiftIds.has(gift.id),
  }));
}

export async function selectGift(payload: {
  giftId: string;
  guestName: string;
  phone: string;
  message: string;
}) {
  const guestName = payload.guestName.trim();

  if (!guestName) {
    return {
      success: false,
      message: "Debes ingresar tu nombre para seleccionar un regalo.",
    };
  }

  const { error } = await supabase.from("gift_selections").insert({
    gift_id: payload.giftId,
    guest_name: guestName,
    phone: payload.phone.trim(),
    message: payload.message.trim(),
  });

  if (error) {
    return {
      success: false,
      message: "Este regalo ya fue seleccionado o no se pudo registrar.",
    };
  }

  return {
    success: true,
    message: "Gracias, el regalo fue reservado correctamente.",
  };
}