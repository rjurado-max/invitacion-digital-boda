"use server";

import { supabase } from "@/lib/supabase";

export async function savePhotoRecord(payload: {
  guestName: string;
  photoUrl: string;
}) {
  const { error } = await supabase.from("event_photos").insert({
    guest_name: payload.guestName.trim() || null,
    photo_url: payload.photoUrl,
  });

  if (error) {
    return {
      success: false,
      message: "La foto se subió, pero no se pudo registrar en la base de datos.",
    };
  }

  return {
    success: true,
    message: "Foto registrada correctamente.",
  };
}

export async function getEventPhotos() {
  const { data, error } = await supabase
    .from("event_photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];

  return data;
}