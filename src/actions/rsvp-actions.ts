"use server";

import { supabase } from "@/lib/supabase";

type RsvpPayload = {
  guestId?: string | null;
  fullName: string;
  phone: string;
  attendance: "SI" | "NO";
  companions: number;
  message: string;
};

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function submitRsvp(payload: RsvpPayload) {
  const fullName = payload.fullName.trim();
  const phone = payload.phone.trim();
  const companions = Number(payload.companions || 0);

  if (!fullName) {
    return {
      success: false,
      message: "Debes ingresar tu nombre completo.",
    };
  }

  const cleanFullName = fullName.replace(/\s+/g, " ");
  const nameParts = cleanFullName.split(" ");

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(cleanFullName)) {
    return {
      success: false,
      message: "El nombre solo debe contener letras.",
    };
  }

  if (nameParts.length < 2) {
    return {
      success: false,
      message: "Debes ingresar al menos un nombre y un apellido.",
    };
  }

  if (!/^9\d{8}$/.test(phone)) {
    return {
      success: false,
      message: "Debes ingresar un celular válido de 9 dígitos que empiece con 9.",
    };
  }

  let guest = null;

  if (payload.guestId) {
    const { data } = await supabase
      .from("guests")
      .select("id, full_name, max_companions")
      .eq("id", payload.guestId)
      .maybeSingle();

    guest = data;
  } else {
    const { data } = await supabase
      .from("guests")
      .select("id, full_name, max_companions")
      .ilike("full_name", `%${cleanFullName}%`)
      .limit(1)
      .maybeSingle();

    guest = data;
  }

  if (guest && companions > guest.max_companions) {
    return {
      success: false,
      message: `Solo puedes registrar hasta ${guest.max_companions} acompañante(s).`,
    };
  }

  const nameToSave = guest?.full_name ?? cleanFullName;
  const normalizedNameToSave = normalizeText(nameToSave);

  const { data: existingRsvps, error: existingError } = await supabase
    .from("rsvps")
    .select("id, guest_id, full_name, phone");

  if (existingError) {
    return {
      success: false,
      message: "No se pudo validar si ya existe una confirmación previa.",
    };
  }

  const duplicateRsvp = (existingRsvps ?? []).find((rsvp) => {
    const sameGuest = guest?.id && rsvp.guest_id === guest.id;
    const samePhone = rsvp.phone === phone;
    const sameName = normalizeText(rsvp.full_name ?? "") === normalizedNameToSave;

    return sameGuest || samePhone || sameName;
  });

  if (duplicateRsvp) {
    return {
      success: false,
      message:
        "Ya existe una confirmación registrada con este nombre o número de celular.",
    };
  }

  const totalAttendees = payload.attendance === "SI" ? 1 + companions : 0;

  const { error } = await supabase.from("rsvps").insert({
    guest_id: guest?.id ?? null,
    full_name: nameToSave,
    phone,
    attendance: payload.attendance,
    companions,
    message: payload.message.trim(),
    total_attendees: totalAttendees,
  });

  if (error) {
    return {
      success: false,
      message: "No se pudo registrar tu confirmación. Inténtalo nuevamente.",
    };
  }

  return {
    success: true,
    message:
      payload.attendance === "SI"
        ? "Gracias, tu asistencia fue confirmada correctamente."
        : "Gracias, hemos registrado que no podrás asistir.",
  };
}