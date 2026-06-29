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

  const totalAttendees = payload.attendance === "SI" ? 1 + companions : 0;

  let existingRsvp = null;

  if (guest) {
    const { data } = await supabase
      .from("rsvps")
      .select("id, table_number")
      .eq("guest_id", guest.id)
      .maybeSingle();

    existingRsvp = data;
  } else if (phone) {
    const { data } = await supabase
      .from("rsvps")
      .select("id, table_number")
      .eq("phone", phone)
      .maybeSingle();

    existingRsvp = data;
  }

  if (existingRsvp) {
    const { error } = await supabase
      .from("rsvps")
      .update({
        full_name: guest?.full_name ?? cleanFullName,
        phone,
        attendance: payload.attendance,
        companions,
        message: payload.message.trim(),
        total_attendees: totalAttendees,
      })
      .eq("id", existingRsvp.id);

    if (error) {
      return {
        success: false,
        message: "No se pudo actualizar tu confirmación. Inténtalo nuevamente.",
      };
    }

    return {
      success: true,
      message:
        payload.attendance === "SI"
          ? "Tu confirmación fue actualizada correctamente."
          : "Actualizamos que no podrás asistir.",
    };
  }

  const { error } = await supabase.from("rsvps").insert({
    guest_id: guest?.id ?? null,
    full_name: guest?.full_name ?? cleanFullName,
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