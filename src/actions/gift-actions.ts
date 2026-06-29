"use server";

import { supabase } from "@/lib/supabase";

export async function getGifts() {
  const { data: gifts, error: giftsError } = await supabase
    .from("gifts")
    .select("id, name, description, price, image_url, category")
    .eq("is_active", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
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
    category: gift.category,
    selected: selectedGiftIds.has(gift.id),
  }));
}

export async function getGiftCategories() {
  const { data: categories, error: categoriesError } = await supabase
    .from("gift_categories")
    .select("name, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (categoriesError || !categories) {
    return [];
  }

  const { data: gifts, error: giftsError } = await supabase
    .from("gifts")
    .select("category")
    .eq("is_active", true)
    .not("category", "is", null);

  if (giftsError || !gifts) {
    return [];
  }

  const categoriesWithActiveGifts = new Set(
    gifts
      .map((gift) => gift.category)
      .filter((category): category is string => Boolean(category))
  );

  return categories
    .filter((category) => categoriesWithActiveGifts.has(category.name))
    .map((category) => category.name);
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