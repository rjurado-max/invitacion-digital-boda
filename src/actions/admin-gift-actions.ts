"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteGiftSelection(selectionId: string) {
  try {
    const { error } = await supabase
      .from("gift_selections")
      .delete()
      .eq("id", selectionId);

    if (error) {
      return {
        success: false,
        message: "No se pudo liberar el regalo.",
      };
    }

    return {
      success: true,
      message: "Regalo liberado correctamente.",
    };
  } catch {
    return {
      success: false,
      message: "Error liberando regalo.",
    };
  }
}