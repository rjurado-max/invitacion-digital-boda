"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ImagePlus } from "lucide-react";
import {
  createGift,
  createGiftCategory,
  deleteGift,
  getAdminGifts,
  moveGiftCategoryOrder,
  moveGiftOrder,
  toggleGiftCategoryStatus,
  toggleGiftStatus,
  updateGift,
  updateGiftCategory,
  uploadGiftImage,
} from "@/actions/admin-gift-actions";

type Gift = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  is_active: boolean;
};

type GiftSelection = {
  id: string;
  gift_id: string;
  guest_name: string;
  phone: string | null;
  message: string | null;
  created_at: string;
};

type AdminGiftData = {
  gifts: Gift[];
  categories: string[];
  selections: GiftSelection[];
};

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
};

export default function AdminGiftsManager({
  initialAdminCode = "",
}: {
  initialAdminCode?: string;
}) {
  const [adminCode, setAdminCode] = useState(initialAdminCode);
  const [message, setMessage] = useState("");
  const [data, setData] = useState<AdminGiftData | null>(null);
  const [editingGiftId, setEditingGiftId] = useState("");
  const [previewGift, setPreviewGift] = useState<Gift | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState("");
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLDivElement | null>(null);

  const loadData = () => {
    startTransition(async () => {
      const response = await getAdminGifts(adminCode);
      setMessage(response.message);
      setData(response.data);
    });
  };

  const accessPanel = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadData();
  };

  useEffect(() => {
    if (!initialAdminCode || data) return;

    startTransition(async () => {
      const response = await getAdminGifts(initialAdminCode);
      setMessage(response.message);
      setData(response.data);
    });
  }, [initialAdminCode, data]);

  const resetForm = () => {
    setEditingGiftId("");
    setForm(emptyForm);
    setSelectedImage(null);
    setPreviewImage("");
  };

  const startEdit = (gift: Gift) => {
    setEditingGiftId(gift.id);
    setForm({
      name: gift.name ?? "",
      description: gift.description ?? "",
      price: gift.price ? String(gift.price) : "",
      category: gift.category ?? "",
      imageUrl: gift.image_url ?? "",
    });
    setSelectedImage(null);
    setPreviewImage(gift.image_url ?? "");

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    handleSelectedFile(file);
  };

  const handleSelectedFile = (file: File) => {
  setSelectedImage(file);
  setPreviewImage(URL.createObjectURL(file));
};

const handleImageDrop = (event: React.DragEvent<HTMLLabelElement>) => {
  event.preventDefault();

  const file = event.dataTransfer.files?.[0];

  if (!file || !file.type.startsWith("image/")) return;

  handleSelectedFile(file);
};

  const submitGift = () => {
    startTransition(async () => {
      let imageUrl = form.imageUrl;

      if (selectedImage) {
        const uploadResponse = await uploadGiftImage({
          adminCode,
          file: selectedImage,
        });

        if (!uploadResponse.success) {
          setMessage(uploadResponse.message);
          return;
        }

        imageUrl = uploadResponse.imageUrl;
      }

      const response = editingGiftId
        ? await updateGift({
            adminCode,
            giftId: editingGiftId,
            ...form,
            imageUrl,
          })
        : await createGift({
            adminCode,
            ...form,
            imageUrl,
          });

      setMessage(response.message);

      if (response.success) {
        resetForm();
        loadData();
      }
    });
  };

  const changeGiftStatus = (gift: Gift) => {
    startTransition(async () => {
      const response = await toggleGiftStatus({
        adminCode,
        giftId: gift.id,
        isActive: gift.is_active,
      });

      setMessage(response.message);

      if (response.success) {
        loadData();
      }
    });
  };

  const moveGift = (gift: Gift, direction: "up" | "down") => {
  startTransition(async () => {
    const response = await moveGiftOrder({
      adminCode,
      giftId: gift.id,
      direction,
    });

    setMessage(response.message);

    if (response.success) {
      loadData();
    }
  });
};

  const removeGift = (gift: Gift) => {
    const selection = getGiftSelection(gift.id);

    if (selection) {
        const firstConfirmation = confirm(
        `Este regalo está reservado por ${selection.guest_name}.\n\nSi continúas también se eliminará la reserva asociada.\n\n¿Deseas continuar?`
        );

        if (!firstConfirmation) return;

        const secondConfirmation = confirm(
        "Se eliminarán:\n\n• El regalo\n• La reserva asociada\n• La imagen almacenada en Supabase\n\n¿Confirmas la eliminación?"
        );

        if (!secondConfirmation) return;
    } else {
        const confirmed = confirm(
        `¿Deseas eliminar el regalo "${gift.name}"?`
        );

        if (!confirmed) return;
    }

    startTransition(async () => {
        const response = await deleteGift({
        adminCode,
        giftId: gift.id,
        });

        setMessage(response.message);

        if (response.success) {
        if (editingGiftId === gift.id) {
            resetForm();
        }

        loadData();
        }
    });
    };

  const createCategory = () => {
    startTransition(async () => {
        const response = await createGiftCategory({
        adminCode,
        name: newCategoryName,
        });

        setMessage(response.message);

        if (response.success) {
        setNewCategoryName("");
        loadData();
        }
    });
    };

    const saveCategory = () => {
    startTransition(async () => {
        const response = await updateGiftCategory({
        adminCode,
        currentName: editingCategory,
        newName: editingCategoryName,
        });

        setMessage(response.message);

        if (response.success) {
        setEditingCategory("");
        setEditingCategoryName("");
        loadData();
        }
    });
    };

    const changeCategoryStatus = (
    categoryName: string,
    isActive: boolean
    ) => {
    startTransition(async () => {
        const response = await toggleGiftCategoryStatus({
        adminCode,
        categoryName,
        isActive,
        });

        setMessage(response.message);

        if (response.success) {
        loadData();
        }
    });
    };

    const moveCategory = (
    categoryName: string,
    direction: "up" | "down"
    ) => {
    startTransition(async () => {
        const response = await moveGiftCategoryOrder({
        adminCode,
        categoryName,
        direction,
        });

        setMessage(response.message);

        if (response.success) {
        loadData();
        }
    });
    };
  
    const getGiftSelection = (giftId: string) => {
    return data?.selections.find((selection) => selection.gift_id === giftId);
  };

  const categoryStats = useMemo(() => {
    if (!data) return [];

    return data.categories
        .map((category) => {
        const giftsByCategory = data.gifts.filter(
            (gift) => gift.category === category
        );

        return {
            category,
            total: giftsByCategory.length,
            active: giftsByCategory.filter((gift) => gift.is_active).length,
        };
        })
        .filter((item) => item.total > 0);
    }, [data]);

  const giftsGroupedByCategory = useMemo(() => {
    if (!data) return [];

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredGifts = data.gifts.filter((gift) => {
        const giftName = gift.name.toLowerCase();
        const giftCategory = (gift.category ?? "Sin categoría").toLowerCase();

        return (
        giftName.includes(normalizedSearch) ||
        giftCategory.includes(normalizedSearch)
        );
    });

    const grouped = data.categories
        .map((category) => ({
        category,
        gifts: filteredGifts.filter((gift) => gift.category === category),
        }))
        .filter((group) => group.gifts.length > 0);

    const giftsWithoutCategory = filteredGifts.filter((gift) => !gift.category);

    if (giftsWithoutCategory.length > 0) {
        grouped.push({
        category: "Sin categoría",
        gifts: giftsWithoutCategory,
        });
    }

    return grouped;
    }, [data, searchTerm]);

  return (
    <div className="bg-[#f7f1e8] text-[#211b17]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-3xl">
                Administrar categorías
            </h2>

            <div className="mt-5 flex gap-3">
                <input
                value={newCategoryName}
                onChange={(e) =>
                    setNewCategoryName(e.target.value)
                }
                placeholder="Nueva categoría"
                className="flex-1 rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                />

                <button
                type="button"
                onClick={createCategory}
                className="rounded-full bg-black px-6 py-4 text-xs font-black tracking-[0.15em] text-white"
                >
                CREAR
                </button>
            </div>

            <div className="mt-5 space-y-3">
                {data?.categories.map((category) => (
                <div
                    key={category}
                    className="flex items-center justify-between rounded-2xl border border-[#eadfce] p-3"
                    >
                    {editingCategory === category ? (
                    <>
                        <input
                        value={editingCategoryName}
                        onChange={(e) =>
                            setEditingCategoryName(e.target.value)
                        }
                        className="flex-1 rounded-xl border border-[#eadfce] px-4 py-2"
                        />

                        <button
                        type="button"
                        onClick={saveCategory}
                        className="rounded-full bg-green-700 px-4 py-2 text-xs font-black text-white"
                        >
                        GUARDAR
                        </button>
                    </>
                    ) : (
                    <>
                        <span className="font-bold text-lg">
                            {category}
                        </span>

                        <div className="flex items-center gap-3">
                            <button
                            type="button"
                            onClick={() => {
                                setEditingCategory(category);
                                setEditingCategoryName(category);
                            }}
                            className="rounded-full bg-black px-4 py-2 text-xs font-black text-white"
                            >
                            EDITAR
                            </button>

                            <button
                            type="button"
                            onClick={() =>
                                changeCategoryStatus(category, true)
                            }
                            className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white"
                            >
                            DESACTIVAR
                            </button>

                            <button
                            type="button"
                            onClick={() =>
                                moveCategory(category, "up")
                            }
                            className="rounded-full border border-[#eadfce] px-4 py-2 text-xs"
                            >
                            ↑
                            </button>

                            <button
                            type="button"
                            onClick={() =>
                                moveCategory(category, "down")
                            }
                            className="rounded-full border border-[#eadfce] px-4 py-2 text-xs"
                            >
                            ↓
                            </button>
                        </div>
                        </>
                    )}
                </div>
                ))}
            </div>
            </div>
        <h1 className="font-serif text-5xl">Administrar regalos</h1>

        <p className="mt-4 text-lg text-neutral-600">
          Agrega, edita, categoriza, activa o desactiva los regalos de la mesa.
        </p>

        {!data && !initialAdminCode && (
          <form
            onSubmit={accessPanel}
            className="mt-10 max-w-md rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm"
          >
            <label className="text-sm font-bold tracking-[0.25em] text-[#9d7c43]">
              CÓDIGO ADMIN
            </label>

            <input
              value={adminCode}
              onChange={(event) => setAdminCode(event.target.value)}
              placeholder="Ingresa el código"
              className="mt-4 w-full rounded-2xl border border-[#eadfce] px-5 py-4 text-lg outline-none"
            />

            <button
              disabled={isPending}
              className="mt-5 w-full rounded-full bg-black px-6 py-5 text-sm font-black tracking-[0.25em] text-white disabled:opacity-60"
            >
              {isPending ? "CARGANDO..." : "INGRESAR"}
            </button>

            {message && (
              <div className="mt-5 rounded-2xl bg-[#fbf6ed] p-4 text-center text-neutral-700">
                {message}
              </div>
            )}
          </form>
        )}

        {data && (
          <section className="mt-10 grid items-start gap-8 lg:grid-cols-[420px_1fr]">
            <div
              ref={formRef}
              className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm lg:sticky lg:top-8"
            >
              <h2 className="font-serif text-3xl">
                {editingGiftId ? "Editar regalo" : "Agregar regalo"}
              </h2>

              <div className="mt-6 space-y-4">
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Nombre del regalo"
                  className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                />

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Descripción"
                  rows={3}
                  className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                />

                <input
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  placeholder="Precio referencial"
                  type="number"
                  className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                />

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                >
                  <option value="">Selecciona categoría</option>
                  {data.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <label
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleImageDrop}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7c5aa] bg-[#fbf6ed] px-5 py-6 text-center transition hover:border-[#9d7c43] hover:bg-[#f6efe3]"
                    >
                    <ImagePlus size={30} className="text-[#9d7c43]" />

                    <span className="mt-3 text-sm font-black tracking-[0.2em] text-[#9d7c43]">
                        ARRASTRA UNA IMAGEN
                    </span>

                    <span className="mt-1 text-sm text-neutral-500">o haz clic para seleccionarla</span>

                    {selectedImage && (
                        <span className="mt-3 max-w-full truncate text-sm text-neutral-600">
                        {selectedImage.name}
                        </span>
                    )}

                    {!selectedImage && previewImage && (
                        <span className="mt-3 text-sm text-neutral-600">Imagen actual del regalo</span>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    </label>

                    {previewImage && (
                    <div className="overflow-hidden rounded-2xl border border-[#eadfce] bg-[#fbf6ed]">
                        <img
                        src={previewImage}
                        alt="Vista previa del regalo"
                        className="h-48 w-full object-contain p-4"
                        />
                    </div>
                    )}

                <button
                  type="button"
                  onClick={submitGift}
                  disabled={isPending}
                  className="w-full rounded-full bg-black px-6 py-5 text-sm font-black tracking-[0.25em] text-white disabled:opacity-60"
                >
                  {isPending
                    ? "GUARDANDO..."
                    : editingGiftId
                      ? "ACTUALIZAR REGALO"
                      : "AGREGAR REGALO"}
                </button>

                {editingGiftId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-full border border-[#eadfce] px-6 py-4 text-sm font-black tracking-[0.25em] text-[#9d7c43]"
                  >
                    CANCELAR EDICIÓN
                  </button>
                )}

                {message && (
                  <div className="rounded-2xl bg-[#fbf6ed] p-4 text-center text-neutral-700">
                    {message}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl">Regalos registrados</h2>

                {categoryStats.length > 0 && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {categoryStats.map((item) => (
                    <div
                        key={item.category}
                        className="rounded-2xl border border-[#eadfce] bg-[#fbf6ed] px-4 py-3"
                    >
                        <p className="text-xs font-black tracking-[0.2em] text-[#9d7c43]">
                        {item.category.toUpperCase()}
                        </p>

                        <p className="mt-1 text-sm text-neutral-700">
                        {item.total} regalo{item.total === 1 ? "" : "s"} registrados
                        </p>

                        <p className="text-sm text-neutral-500">
                        {item.active} activo{item.active === 1 ? "" : "s"}
                        </p>
                    </div>
                    ))}
                </div>
                )}

                <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre o categoría"
                className="mt-5 w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                />

                <div className="mt-6 max-h-[720px] space-y-5 overflow-y-auto pr-3">
                {data.gifts.length === 0 ? (
                    <p className="text-neutral-500">No hay regalos registrados.</p>
                    ) : giftsGroupedByCategory.length === 0 ? (
                    <p className="text-neutral-500">
                        No se encontraron regalos con ese criterio de búsqueda.
                    </p>
                    ) : (
                    giftsGroupedByCategory.map((group) => (
                        <div key={group.category} className="space-y-5">
                        <div className="sticky top-0 z-10 rounded-full border border-[#eadfce] bg-[#fbf6ed] px-5 py-3 text-sm font-black tracking-[0.2em] text-[#9d7c43]">
                            {group.category.toUpperCase()}
                        </div>

                        {group.gifts.map((gift) => {
                            const selection = getGiftSelection(gift.id);

                            return (
                            <article
                                key={gift.id}
                                className={`rounded-2xl border p-4 ${
                                editingGiftId === gift.id
                                    ? "border-[#9d7c43] bg-[#fbf6ed]"
                                    : "border-[#eadfce]"
                                }`}
                            >
                                <div className="flex gap-4">
                                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fbf6ed]">
                                    {gift.image_url ? (
                                    <img
                                        src={gift.image_url}
                                        alt={gift.name}
                                        className="h-full w-full object-contain"
                                    />
                                    ) : (
                                    <span className="text-sm text-neutral-400">
                                        Sin imagen
                                    </span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-serif text-2xl">{gift.name}</h3>

                                    <p className="mt-1 text-sm text-neutral-600">
                                    {gift.description || "Sin descripción"}
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-[#9d7c43]">
                                    {gift.category || "Sin categoría"}
                                    </p>

                                    <p className="mt-1 text-sm text-neutral-600">
                                    {gift.price ? `S/ ${gift.price}` : "Sin precio"}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        Estado:{" "}
                                        <strong>
                                            {gift.is_active ? "Activo" : "Inactivo"}
                                        </strong>
                                        </p>

                                        <p className="mt-1 text-sm">
                                        Reserva:{" "}
                                        <strong className={selection ? "text-red-700" : "text-green-700"}>
                                            {selection ? "Reservado" : "Disponible"}
                                        </strong>
                                        </p>

                                    {selection && (
                                    <div className="mt-3 rounded-xl bg-[#fbf6ed] p-3 text-sm text-neutral-700">
                                        <p>
                                        Reservado por:{" "}
                                        <strong>{selection.guest_name}</strong>
                                        </p>
                                        <p>Celular: {selection.phone || "-"}</p>
                                        <p>Mensaje: {selection.message || "-"}</p>
                                    </div>
                                    )}
                                </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => moveGift(gift, "up")}
                                    className="rounded-full border border-[#eadfce] px-4 py-3 text-xs font-black text-[#9d7c43]"
                                >
                                    ↑
                                </button>

                                <button
                                    type="button"
                                    onClick={() => moveGift(gift, "down")}
                                    className="rounded-full border border-[#eadfce] px-4 py-3 text-xs font-black text-[#9d7c43]"
                                >
                                    ↓
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPreviewGift(gift)}
                                    className="rounded-full bg-[#9d7c43] px-5 py-3 text-xs font-black tracking-[0.15em] text-white"
                                    >
                                    VISTA INVITADO
                                </button>

                                <button
                                    type="button"
                                    onClick={() => startEdit(gift)}
                                    className="rounded-full bg-black px-5 py-3 text-xs font-black tracking-[0.15em] text-white"
                                >
                                    EDITAR
                                </button>

                                <button
                                    type="button"
                                    onClick={() => changeGiftStatus(gift)}
                                    className={`rounded-full px-5 py-3 text-xs font-black tracking-[0.15em] text-white ${
                                    gift.is_active ? "bg-red-600" : "bg-green-700"
                                    }`}
                                >
                                    {gift.is_active ? "DESACTIVAR" : "ACTIVAR"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => removeGift(gift)}
                                    className="rounded-full bg-[#7f1d1d] px-5 py-3 text-xs font-black tracking-[0.15em] text-white"
                                    >
                                    ELIMINAR
                                    </button>
                                </div>
                            </article>
                            );
                        })}
                        </div>
                    ))
                    )}
              </div>
            </div>
          </section>
        )}
            </div>

            {previewGift && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-6">
                <div className="w-full max-w-[520px] rounded-[2rem] bg-[#fbfaf8] p-5 shadow-2xl">
                    <button
                    type="button"
                    onClick={() => setPreviewGift(null)}
                    className="mb-5 rounded-full border border-[#eadfce] bg-white px-5 py-3 text-xs font-black tracking-[0.2em] text-[#9d7c43]"
                    >
                    CERRAR VISTA
                    </button>

                    <div className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white text-left shadow-sm">
                    {previewGift.image_url ? (
                        <div className="flex h-56 w-full items-center justify-center bg-[#fbf6ed]">
                        <img
                            src={previewGift.image_url}
                            alt={previewGift.name}
                            className="h-full w-full object-contain p-4"
                        />
                        </div>
                    ) : (
                        <div className="flex h-56 w-full items-center justify-center bg-[#fbf6ed] text-[#9d7c43]">
                        Sin imagen
                        </div>
                    )}

                    <div className="p-6">
                        <h3 className="font-serif text-3xl text-[#211b17]">
                        {previewGift.name}
                        </h3>

                <div className="mt-4 flex items-center gap-2 text-sm font-black tracking-[0.25em] text-[#9d7c43]">
                  {getGiftSelection(previewGift.id) ? "RESERVADO" : "DISPONIBLE"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}