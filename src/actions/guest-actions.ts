"use server";

import { supabase } from "@/lib/supabase";

export async function findGuestTable(fullName: string) {
  const search = fullName.trim();

  if (!search) {
    return {
      success: false,
      message: "Ingresa tu nombre completo para buscar tu mesa.",
    };
  }

  const { data, error } = await supabase
    .from("guests")
    .select("full_name, table_number")
    .ilike("full_name", `%${search}%`)
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      message: "Ocurrió un error al buscar tu mesa.",
    };
  }

  if (!data) {
    return {
      success: false,
      message: "No encontramos tu mesa. Verifica tu nombre o consulta con los novios.",
    };
  }

  return {
    success: true,
    message: `${data.full_name}, estarás ubicado en ${data.table_number}.`,
  };
}

export async function getGuestByToken(token: string) {
  if (!token) return null;

  const { data, error } = await supabase
    .from("guests")
    .select("id, full_name, phone, table_number, max_companions, token, access_code, invitation_group")
    .eq("token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;

  return data;
}

export async function validateGuestAccess(token: string, accessCode: string) {
  const guest = await getGuestByToken(token);

  if (!guest) {
    return {
      success: false,
      message: "Invitación no encontrada o inactiva.",
      guest: null,
    };
  }

  if (guest.access_code !== accessCode.trim()) {
    return {
      success: false,
      message: "Código de acceso incorrecto.",
      guest: null,
    };
  }

  return {
    success: true,
    message: "Acceso validado correctamente.",
    guest,
  };
}