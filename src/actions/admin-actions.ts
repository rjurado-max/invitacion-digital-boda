"use server";

import { supabase } from "@/lib/supabase";

type AdminResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

function validateAdminCode(adminCode: string) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;

  if (!configuredCode) {
    return false;
  }

  return adminCode.trim() === configuredCode;
}

export async function getAdminDashboardData(
  adminCode: string
): Promise<
  AdminResponse<{
    rsvps: any[];
    gifts: any[];
    giftSelections: any[];
    eventPhotos: any[];
    photosByGuest: Record<string, number>;
    totals: {
      confirmedGuests: number;
      declinedGuests: number;
      totalAttendees: number;
      reservedGifts: number;
      uploadedPhotos: number;
    };
  }>
> {
  if (!validateAdminCode(adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
      data: null,
    };
  }

  const { data: rsvps, error: rsvpsError } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: gifts, error: giftsError } = await supabase
    .from("gifts")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: giftSelections, error: giftSelectionsError } = await supabase
    .from("gift_selections")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: eventPhotos, error: eventPhotosError } = await supabase
    .from("event_photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (rsvpsError || giftsError || giftSelectionsError || eventPhotosError) {
    return {
      success: false,
      message: "No se pudo cargar la información administrativa.",
      data: null,
    };
  }

  const safeRsvps = rsvps ?? [];
  const safeGiftSelections = giftSelections ?? [];
  const safeEventPhotos = eventPhotos ?? [];

  const confirmedGuests = safeRsvps.filter(
    (item) => item.attendance === "SI"
  ).length;

  const declinedGuests = safeRsvps.filter(
    (item) => item.attendance === "NO"
  ).length;

  const totalAttendees = safeRsvps.reduce(
    (total, item) => total + Number(item.total_attendees || 0),
    0
  );

  const photosByGuest = safeEventPhotos.reduce((acc, photo) => {
    const guestName = photo.guest_name || "Invitado";

    acc[guestName] = (acc[guestName] || 0) + 1;

    return acc;
  }, {} as Record<string, number>);

  return {
    success: true,
    message: "Información cargada correctamente.",
    data: {
      rsvps: safeRsvps,
      gifts: gifts ?? [],
      giftSelections: safeGiftSelections,
      eventPhotos: safeEventPhotos,
      photosByGuest,
      totals: {
        confirmedGuests,
        declinedGuests,
        totalAttendees,
        reservedGifts: safeGiftSelections.length,
        uploadedPhotos: safeEventPhotos.length,
      },
    },
  };
}