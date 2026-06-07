"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deletePhoto(photoUrl: string) {
  try {
    const filePath = photoUrl.split("/event-photos/")[1];

    if (!filePath) {
      return {
        success: false,
        message: "Ruta inválida",
      };
    }

    await supabase.storage
      .from("event-photos")
      .remove([filePath]);

    await supabase
      .from("event_photos")
      .delete()
      .eq("photo_url", photoUrl);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Error eliminando foto",
    };
  }
}