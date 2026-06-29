"use client";

import { useState, useTransition } from "react";
import { deleteRsvp, getAdminDashboardData } from "@/actions/admin-actions";
import { deletePhoto } from "@/actions/admin-photo-actions";
import { deleteGiftSelection } from "@/actions/admin-gift-actions";
import AdminGiftsManager from "@/components/AdminGiftsManager";
import AdminTablesManager from "@/components/AdminTablesManager";

type DashboardData = {
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
};

export default function AdminDashboard() {
  const [adminCode, setAdminCode] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<"dashboard" | "gifts" | "tables">("dashboard");

  const loadDashboard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await getAdminDashboardData(adminCode);
      setMessage(response.message);
      setData(response.data);
    });
  };

  const refreshDashboard = () => {
    startTransition(async () => {
      const response = await getAdminDashboardData(adminCode);
      setMessage(response.message);
      setData(response.data);
    });
  };

  const exportCsv = (filename: string, headers: string[], rows: string[][]) => {
  const separator = ";";

  const normalizeValue = (value: string) =>
    `"${String(value ?? "")
      .replaceAll('"', '""')
      .replaceAll("\n", " ")
      .replaceAll("\r", " ")}"`;

  const csvContent = [
    headers.map(normalizeValue).join(separator),
    ...rows.map((row) => row.map(normalizeValue).join(separator)),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  const exportRsvps = () => {
    if (!data) return;

    exportCsv(
      "confirmaciones-rsvp.csv",
      ["Nombre", "Celular", "Asistencia", "Acompañantes", "Total", "Mensaje", "Fecha"],
      data.rsvps.map((item) => [
        item.full_name,
        item.phone || "",
        item.attendance,
        String(item.companions ?? 0),
        String(item.total_attendees ?? 0),
        item.message || "",
        new Date(item.created_at).toLocaleString(),
      ])
    );
  };

  const exportGiftSelections = () => {
    if (!data) return;

    exportCsv(
      "regalos-reservados.csv",
      ["Invitado", "Regalo", "Mensaje", "Fecha"],
      data.giftSelections.map((item) => [
        item.guest_name,
        getGiftName(item.gift_id),
        item.message || "",
        new Date(item.created_at).toLocaleString(),
      ])
    );
  };

  const getGiftName = (giftId: string) => {
    const gift = data?.gifts.find((item) => item.id === giftId);

    return gift?.name ?? "Regalo no encontrado";
  };

  const exportPhotos = () => {
    if (!data) return;

    exportCsv(
      "fotos-evento.csv",
      ["Invitado", "URL Foto", "Fecha"],
      data.eventPhotos.map((item) => [
        item.guest_name || "",
        item.photo_url,
        new Date(item.created_at).toLocaleString(),
      ])
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-6 py-12 text-[#211b17]">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-5xl">Panel de administración</h1>

        <p className="mt-4 text-lg text-neutral-600">
          Consulta confirmaciones, regalos reservados y fotos compartidas por los invitados.
        </p>

        {!data && (
          <form
            onSubmit={loadDashboard}
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

        {data && view === "dashboard" && (
          <section className="mt-10 space-y-10">
            <div className="grid gap-5 md:grid-cols-5">
              <SummaryCard title="Confirmados" value={data.totals.confirmedGuests} />
              <SummaryCard title="No asistirán" value={data.totals.declinedGuests} />
              <SummaryCard title="Asistentes" value={data.totals.totalAttendees} />
              <SummaryCard title="Regalos" value={data.totals.reservedGifts} />
              <SummaryCard title="Fotos" value={data.totals.uploadedPhotos} />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={exportRsvps}
                className="rounded-full bg-black px-6 py-4 text-sm font-black tracking-[0.2em] text-white"
              >
                EXPORTAR RSVP
              </button>

              <button
                onClick={exportGiftSelections}
                className="rounded-full bg-black px-6 py-4 text-sm font-black tracking-[0.2em] text-white"
              >
                EXPORTAR REGALOS
              </button>

              <button
                onClick={exportPhotos}
                className="rounded-full bg-black px-6 py-4 text-sm font-black tracking-[0.2em] text-white"
              >
                EXPORTAR FOTOS
              </button>

              <button
                onClick={() => setView("gifts")}
                className="rounded-full bg-[#9d7c43] px-6 py-4 text-sm font-black tracking-[0.2em] text-white"
              >
                ADMINISTRAR REGALOS
              </button>

              <button
                onClick={() => setView("tables")}
                className="rounded-full bg-[#9d7c43] px-6 py-4 text-sm font-black tracking-[0.2em] text-white"
              >
                ADMINISTRAR MESAS
              </button>
            </div>

            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl">Confirmaciones RSVP</h2>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#eadfce]">
                      {[
                        "Nombre",
                        "Celular",
                        "Asistencia",
                        "Acompañantes",
                        "Total",
                        "Mensaje",
                        "Acción",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-sm font-black tracking-[0.15em] text-[#9d7c43]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.rsvps.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                          Sin registros.
                        </td>
                      </tr>
                    ) : (
                      data.rsvps.map((item) => (
                        <tr key={item.id} className="border-b border-[#f0e7d8]">
                          <td className="px-4 py-4">{item.full_name}</td>
                          <td className="px-4 py-4">{item.phone || "-"}</td>
                          <td className="px-4 py-4">{item.attendance}</td>
                          <td className="px-4 py-4">{String(item.companions ?? 0)}</td>
                          <td className="px-4 py-4">{String(item.total_attendees ?? 0)}</td>
                          <td className="px-4 py-4">{item.message || "-"}</td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={async () => {
                                const confirmed = confirm(
                                  `¿Deseas eliminar la confirmación RSVP de "${item.full_name}"?`
                                );

                                if (!confirmed) return;

                                const response = await deleteRsvp({
                                  adminCode,
                                  rsvpId: item.id,
                                });

                                setMessage(response.message);

                                if (response.success) {
                                  refreshDashboard();
                                }
                              }}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white"
                            >
                              ELIMINAR
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl">Regalos reservados</h2>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#eadfce]">
                      <th className="px-4 py-3 text-sm font-black tracking-[0.15em] text-[#9d7c43]">
                        Invitado
                      </th>
                      <th className="px-4 py-3 text-sm font-black tracking-[0.15em] text-[#9d7c43]">
                        Regalo
                      </th>
                      <th className="px-4 py-3 text-sm font-black tracking-[0.15em] text-[#9d7c43]">
                        Mensaje
                      </th>
                      <th className="px-4 py-3 text-sm font-black tracking-[0.15em] text-[#9d7c43]">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-sm font-black tracking-[0.15em] text-[#9d7c43]">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.giftSelections.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                          Sin registros.
                        </td>
                      </tr>
                    ) : (
                      data.giftSelections.map((item) => (
                        <tr key={item.id} className="border-b border-[#f0e7d8]">
                          <td className="px-4 py-4">{item.guest_name}</td>
                          <td className="px-4 py-4 font-semibold text-[#211b17]">
                            {getGiftName(item.gift_id)}
                          </td>
                          <td className="px-4 py-4">{item.message || "-"}</td>
                          <td className="px-4 py-4">
                            {new Date(item.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={async () => {
                                const confirmed = confirm("¿Liberar este regalo reservado?");
                                if (!confirmed) return;

                                const response = await deleteGiftSelection(item.id);

                                if (response.success) {
                                  refreshDashboard();
                                }
                              }}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white"
                            >
                              LIBERAR
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl">Fotos del evento</h2>

              {data.eventPhotos.length === 0 ? (
                <p className="mt-4 text-neutral-500">Aún no hay fotos subidas.</p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {data.eventPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-2xl border border-[#eadfce] bg-[#fbf6ed]"
                    >
                      <img
                        src={photo.photo_url}
                        alt={photo.guest_name || "Foto del evento"}
                        className="h-44 w-full object-cover"
                      />

                      <div className="p-3 text-center text-sm">
                      <p>{photo.guest_name || "Invitado"}</p>

                      <p className="mt-1 text-sm text-neutral-500">
                        Total fotos: {data.photosByGuest[photo.guest_name] ?? 0}
                      </p>
                    </div>
                    <button
                      className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs text-white"
                      onClick={async () => {
                        const confirmed = confirm(
                          "¿Eliminar esta fotografía?"
                        );

                        if (!confirmed) return;

                        const response = await deletePhoto(photo.photo_url);

                        if (response.success) {
                          refreshDashboard();
                        }
                      }}
                    >
                      ELIMINAR
                    </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {data && view === "gifts" && (
          <section className="mt-10">
            <button
              onClick={() => setView("dashboard")}
              className="mb-8 rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-black tracking-[0.2em] text-[#9d7c43]"
            >
              ← VOLVER AL PANEL
            </button>

            <AdminGiftsManager initialAdminCode={adminCode} />
          </section>
        )}

        {data && view === "tables" && (
          <section className="mt-10">
            <button
              onClick={() => setView("dashboard")}
              className="mb-8 rounded-full border border-[#eadfce] bg-white px-6 py-3 text-sm font-black tracking-[0.2em] text-[#9d7c43]"
            >
              ← VOLVER AL PANEL
            </button>

            <AdminTablesManager initialAdminCode={adminCode} />
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 text-center shadow-sm">
      <p className="font-serif text-4xl">{value}</p>
      <p className="mt-2 text-xs font-black tracking-[0.25em] text-[#9d7c43]">
        {title.toUpperCase()}
      </p>
    </div>
  );
}

function AdminTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
      <h2 className="font-serif text-3xl">{title}</h2>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#eadfce]">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-sm font-black tracking-[0.15em] text-[#9d7c43]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-6 text-center text-neutral-500"
                >
                  Sin registros.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#f0e7d8]">
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}