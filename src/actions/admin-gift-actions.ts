"use server";

import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function validateAdminCode(adminCode: string) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;

  if (!configuredCode) {
    return false;
  }

  return adminCode.trim() === configuredCode;
}

function getGiftStoragePathFromUrl(imageUrl: string | null) {
  if (!imageUrl) return null;

  const marker = "/storage/v1/object/public/gift-images/";

  if (!imageUrl.includes(marker)) return null;

  return decodeURIComponent(imageUrl.split(marker)[1]);
}

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

export async function uploadGiftImage(payload: {
  adminCode: string;
  file: File;
}) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;

  if (!configuredCode || payload.adminCode.trim() !== configuredCode) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
      imageUrl: "",
    };
  }

  if (!payload.file) {
    return {
      success: false,
      message: "Debes seleccionar una imagen.",
      imageUrl: "",
    };
  }

  const fileExtension = payload.file.name.split(".").pop() || "jpg";
  const fileName = `${randomUUID()}.${fileExtension}`;
  const filePath = `regalos/${fileName}`;

  const { error } = await supabase.storage
    .from("gift-images")
    .upload(filePath, payload.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: payload.file.type,
    });

  if (error) {
    return {
      success: false,
      message: "No se pudo subir la imagen del regalo.",
      imageUrl: "",
    };
  }

  const { data } = supabase.storage.from("gift-images").getPublicUrl(filePath);

  return {
    success: true,
    message: "Imagen subida correctamente.",
    imageUrl: data.publicUrl,
  };
}

export async function getAdminGifts(adminCode: string) {
  if (!validateAdminCode(adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
      data: null,
    };
  }

  const { data: gifts, error: giftsError } = await supabase
    .from("gifts")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const { data: categories, error: categoriesError } = await supabase
    .from("gift_categories")
    .select("name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: selections, error: selectionsError } = await supabase
    .from("gift_selections")
    .select("*")
    .order("created_at", { ascending: false });

  if (giftsError || categoriesError || selectionsError) {
    return {
      success: false,
      message: "No se pudo cargar la información de regalos.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Información cargada correctamente.",
    data: {
      gifts: gifts ?? [],
      categories: (categories ?? []).map((category) => category.name),
      selections: selections ?? [],
    },
  };
}

export async function createGift(payload: {
  adminCode: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const giftName = payload.name.trim();

  if (!giftName) {
    return {
      success: false,
      message: "Debes ingresar el nombre del regalo.",
    };
  }

  const { error } = await supabase.from("gifts").insert({
    name: giftName,
    description: payload.description.trim() || null,
    price: payload.price ? Number(payload.price) : null,
    category: payload.category || null,
    image_url: payload.imageUrl.trim() || null,
    is_active: true,
  });

  if (error) {
    return {
      success: false,
      message: "No se pudo agregar el regalo.",
    };
  }

  return {
    success: true,
    message: "Regalo agregado correctamente.",
  };
}

export async function updateGift(payload: {
  adminCode: string;
  giftId: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const giftName = payload.name.trim();

  if (!giftName) {
    return {
      success: false,
      message: "Debes ingresar el nombre del regalo.",
    };
  }

  const { data: currentGift, error: currentGiftError } = await supabase
    .from("gifts")
    .select("image_url")
    .eq("id", payload.giftId)
    .single();

  if (currentGiftError) {
    return {
      success: false,
      message: "No se pudo obtener la imagen anterior del regalo.",
    };
  }

  const previousImageUrl = currentGift?.image_url ?? null;
  const newImageUrl = payload.imageUrl.trim() || null;

  const { error } = await supabase
    .from("gifts")
    .update({
      name: giftName,
      description: payload.description.trim() || null,
      price: payload.price ? Number(payload.price) : null,
      category: payload.category || null,
      image_url: newImageUrl,
    })
    .eq("id", payload.giftId);

  if (error) {
    return {
      success: false,
      message: "No se pudo actualizar el regalo.",
    };
  }

  if (previousImageUrl && newImageUrl && previousImageUrl !== newImageUrl) {
    const previousImagePath = getGiftStoragePathFromUrl(previousImageUrl);

    if (previousImagePath) {
      await supabase.storage.from("gift-images").remove([previousImagePath]);
    }
  }

  return {
    success: true,
    message: "Regalo actualizado correctamente.",
  };
}

export async function toggleGiftStatus(payload: {
  adminCode: string;
  giftId: string;
  isActive: boolean;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const { error } = await supabase
    .from("gifts")
    .update({
      is_active: !payload.isActive,
    })
    .eq("id", payload.giftId);

  if (error) {
    return {
      success: false,
      message: "No se pudo cambiar el estado del regalo.",
    };
  }

  return {
    success: true,
    message: payload.isActive
      ? "Regalo desactivado correctamente."
      : "Regalo activado correctamente.",
  };
}

export async function deleteGift(payload: {
  adminCode: string;
  giftId: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const { data: currentGift, error: currentGiftError } = await supabase
    .from("gifts")
    .select("image_url")
    .eq("id", payload.giftId)
    .single();

  if (currentGiftError) {
    return {
      success: false,
      message: "No se pudo obtener la información del regalo.",
    };
  }

  const { data: existingSelections, error: selectionsCheckError } = await supabase
    .from("gift_selections")
    .select("id")
    .eq("gift_id", payload.giftId);

  if (selectionsCheckError) {
    return {
      success: false,
      message: "No se pudo validar si el regalo tiene reservas.",
    };
  }

  if ((existingSelections ?? []).length > 0) {
    const { error: deleteSelectionsError } = await supabase
      .from("gift_selections")
      .delete()
      .eq("gift_id", payload.giftId);

    if (deleteSelectionsError) {
      return {
        success: false,
        message: "No se pudo eliminar la reserva asociada al regalo.",
      };
    }
  }

  const { error: giftError } = await supabase
    .from("gifts")
    .delete()
    .eq("id", payload.giftId);

  if (giftError) {
    return {
      success: false,
      message: "No se pudo eliminar el regalo.",
    };
  }

  const imagePath = getGiftStoragePathFromUrl(currentGift?.image_url ?? null);

  if (imagePath) {
    await supabase.storage.from("gift-images").remove([imagePath]);
  }

  return {
    success: true,
    message: "Regalo eliminado correctamente.",
  };
}

export async function moveGiftOrder(payload: {
  adminCode: string;
  giftId: string;
  direction: "up" | "down";
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const { data: currentGift, error: currentGiftError } = await supabase
    .from("gifts")
    .select("id, category, sort_order")
    .eq("id", payload.giftId)
    .single();

  if (currentGiftError || !currentGift) {
    return {
      success: false,
      message: "No se pudo obtener el regalo seleccionado.",
    };
  }

  const query = supabase
    .from("gifts")
    .select("id, sort_order")
    .eq("category", currentGift.category)
    .order("sort_order", { ascending: true });

  const { data: gifts, error: giftsError } = await query;

  if (giftsError || !gifts) {
    return {
      success: false,
      message: "No se pudo obtener el orden de regalos.",
    };
  }

  const currentIndex = gifts.findIndex((gift) => gift.id === payload.giftId);

  if (currentIndex === -1) {
    return {
      success: false,
      message: "No se encontró el regalo en la categoría.",
    };
  }

  const targetIndex =
    payload.direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= gifts.length) {
    return {
      success: false,
      message: "El regalo ya se encuentra en esa posición.",
    };
  }

  const currentItem = gifts[currentIndex];
  const targetItem = gifts[targetIndex];

  const { error: currentUpdateError } = await supabase
    .from("gifts")
    .update({ sort_order: targetItem.sort_order })
    .eq("id", currentItem.id);

  if (currentUpdateError) {
    return {
      success: false,
      message: "No se pudo actualizar el orden del regalo.",
    };
  }

  const { error: targetUpdateError } = await supabase
    .from("gifts")
    .update({ sort_order: currentItem.sort_order })
    .eq("id", targetItem.id);

  if (targetUpdateError) {
    return {
      success: false,
      message: "No se pudo actualizar el orden del regalo.",
    };
  }

  return {
    success: true,
    message: "Orden actualizado correctamente.",
  };
}

export async function createGiftCategory(payload: {
  adminCode: string;
  name: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return { success: false, message: "Código de administración incorrecto." };
  }

  const categoryName = payload.name.trim();

  if (!categoryName) {
    return { success: false, message: "Debes ingresar el nombre de la categoría." };
  }

  const { data: lastCategory } = await supabase
    .from("gift_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("gift_categories").insert({
    name: categoryName,
    sort_order: (lastCategory?.sort_order ?? 0) + 1,
    is_active: true,
  });

  if (error) {
    return { success: false, message: "No se pudo crear la categoría." };
  }

  return { success: true, message: "Categoría creada correctamente." };
}

export async function updateGiftCategory(payload: {
  adminCode: string;
  currentName: string;
  newName: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return { success: false, message: "Código de administración incorrecto." };
  }

  const newName = payload.newName.trim();

  if (!newName) {
    return { success: false, message: "Debes ingresar el nuevo nombre." };
  }

  const { error: categoryError } = await supabase
    .from("gift_categories")
    .update({ name: newName })
    .eq("name", payload.currentName);

  if (categoryError) {
    return { success: false, message: "No se pudo actualizar la categoría." };
  }

  await supabase
    .from("gifts")
    .update({ category: newName })
    .eq("category", payload.currentName);

  return { success: true, message: "Categoría actualizada correctamente." };
}

export async function toggleGiftCategoryStatus(payload: {
  adminCode: string;
  categoryName: string;
  isActive: boolean;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return { success: false, message: "Código de administración incorrecto." };
  }

  const { error } = await supabase
    .from("gift_categories")
    .update({ is_active: !payload.isActive })
    .eq("name", payload.categoryName);

  if (error) {
    return { success: false, message: "No se pudo cambiar el estado de la categoría." };
  }

  return {
    success: true,
    message: payload.isActive
      ? "Categoría desactivada correctamente."
      : "Categoría activada correctamente.",
  };
}

export async function moveGiftCategoryOrder(payload: {
  adminCode: string;
  categoryName: string;
  direction: "up" | "down";
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return { success: false, message: "Código de administración incorrecto." };
  }

  const { data: categories, error } = await supabase
    .from("gift_categories")
    .select("name, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !categories) {
    return { success: false, message: "No se pudo obtener el orden de categorías." };
  }

  const currentIndex = categories.findIndex(
    (category) => category.name === payload.categoryName
  );

  const targetIndex =
    payload.direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex === -1 || targetIndex < 0 || targetIndex >= categories.length) {
    return { success: false, message: "La categoría ya está en esa posición." };
  }

  const current = categories[currentIndex];
  const target = categories[targetIndex];

  await supabase
    .from("gift_categories")
    .update({ sort_order: target.sort_order })
    .eq("name", current.name);

  await supabase
    .from("gift_categories")
    .update({ sort_order: current.sort_order })
    .eq("name", target.name);

  return { success: true, message: "Orden de categoría actualizado correctamente." };
}