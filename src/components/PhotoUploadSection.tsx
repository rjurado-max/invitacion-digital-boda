"use client";

import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getEventPhotos, savePhotoRecord } from "@/actions/photo-actions";

type GalleryPhoto = {
  id: string;
  photo_url: string;
  guest_name?: string;
};

type Props = {
  defaultGuestName?: string;
};

export default function PhotoUploadSection({
  defaultGuestName = "",
}: Props) {
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);

  async function loadPhotos() {
    const photos = await getEventPhotos();
    setGallery(photos || []);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    setUploading(true);
    setMessage("");

    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        setMessage("Solo se permiten imágenes.");
        setUploading(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("Cada imagen debe pesar menos de 5MB.");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error } = await supabase.storage
        .from("event-photos")
        .upload(filePath, file);

      if (error) {
        setMessage("No se pudo subir una o más fotos.");
        continue;
      }

      const { data } = supabase.storage
        .from("event-photos")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);

      await savePhotoRecord({
        guestName,
        photoUrl: data.publicUrl,
      });
    }

    setPreviews((current) => [...uploadedUrls, ...current]);
    setUploading(false);

    if (uploadedUrls.length > 0) {
      setMessage("Fotos subidas correctamente.");
      loadPhotos();
    }
  };

  return (
    <section className="bg-[#fbfaf8] px-6 py-24">
      <div className="mx-auto max-w-[520px] text-center">
        <h2 className="font-serif text-5xl leading-tight text-[#211b17]">
          Comparte tus fotos del evento
        </h2>

        <p className="mt-8 text-2xl leading-relaxed text-neutral-600">
          Selecciona tus mejores recuerdos y compártelos con los novios.
        </p>

        <div className="mt-10">
          <input
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            placeholder="Tu nombre completo"
            className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 text-lg outline-none"
          />
        </div>

        <label className="mt-10 block cursor-pointer rounded-[2rem] border border-dashed border-[#b99a63] bg-white p-10">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            className="sr-only"
          />

          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#eadfce] bg-[#fbf6ed] text-[#9d7c43]">
            <Upload size={42} />
          </div>

          <h3 className="font-serif text-4xl text-[#211b17]">Subir fotos</h3>

          <p className="mt-5 text-xl leading-relaxed text-neutral-600">
            Selecciona imágenes desde tu celular o computadora.
          </p>

          <span className="mt-8 inline-flex rounded-full bg-black px-8 py-5 text-sm font-black tracking-[0.25em] text-white">
            {uploading ? "SUBIENDO..." : "SELECCIONAR ARCHIVOS"}
          </span>
        </label>

        {message && (
          <div className="mt-6 rounded-2xl bg-white p-5 text-lg text-neutral-700">
            {message}
          </div>
        )}

        {previews.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4">
            {previews.map((photoUrl) => (
              <img
                key={photoUrl}
                src={photoUrl}
                alt="Foto subida"
                className="h-44 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-12">
          <h3 className="mb-8 text-center font-serif text-3xl text-[#211b17]">
            Galería del evento
          </h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-2xl bg-white"
              >
                <img
                  src={photo.photo_url}
                  alt={photo.guest_name || "Foto del evento"}
                  className="h-48 w-full object-cover"
                />

                <div className="p-2 text-center text-sm">
                  {photo.guest_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}